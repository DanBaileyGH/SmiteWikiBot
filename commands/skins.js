const fetch = require('cross-fetch');
const globalFunctions = require('./globalfunctions.js');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'skins',
    aliases: ["skin", "sk"],
	description: 'Get list of skins for chosen god',
	execute(message, args) {
        if (args == "") { 
            const embed = new MessageEmbed().setDescription("Please Enter a God");
            message.channel.send({embeds: [embed]}); 
            return;
        }
        getGodDetails(message, args);
	},
};

async function getGodDetails(message, godName){
    const godObject = await globalFunctions.findObjectWithShortenedName(godName, "god");
    const god = godObject.object;
    const exactMatch = godObject.exact;
    if (god) {
        getSkinList(god, message, exactMatch);
    } else {
        const embed = new MessageEmbed().setDescription("God Not Found, Check Your Spelling");
        message.channel.send({embeds: [embed]});
    }
}

async function getSkinList(god, message, exactMatch){
    fetch(globalFunctions.generateCreateSessionUrl())
    .then(res => res.json())
    .then(result => {
        sessionId = result.session_id;
        fetch(globalFunctions.generateGodSkinsUrl(sessionId, god.id))
        .then(res => res.json())
        .then(result => {
            parseSkins(result, message, exactMatch);
        });
    });
}

function parseSkins(skins, message, exactMatch) {
    let price = "";
    let link = "";
    let embed = new MessageEmbed()
    .setTitle(`All Skins For ${skins[0].god_name}`)
    .setThumbnail(skins[0].godIcon_URL)
    .setTimestamp()
    .setFooter(`Data from the Smite API`);

    skins.forEach(skin => {
        price = `${[skin.price_gems]} Gems`
        if (skin.price_favor != 0) { 
            price += `\nOR ${[skin.price_favor]} Favor`
        };

        if (skin.godSkin_URL == "") { 
            link = "No Link Available"
        } else {
            link = `[LINK](${skin.godSkin_URL})`
        };
        
        if (skin.obtainability == "Normal") {
            embed.addField(skin.skin_name, `${link} \nPrice: ${price}`, true);
        } else if (skin.obtainability == "Exclusive") {
            embed.addField(skin.skin_name, `${link} \nChest/Event Only`, true);
        } else if (skin.obtainability == "Limited") {
            embed.addField(skin.skin_name, `${link} \nLimited Time Only`, true);
        }
    });
    
    const catchErr = err => {
        console.log(err)
    }

    if (exactMatch) {
        message.channel.send({embeds: [embed]}).catch(catchErr);
    } else {
        message.channel.send({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed]}).catch(catchErr);
    }
}