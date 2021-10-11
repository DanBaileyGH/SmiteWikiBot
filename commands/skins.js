const fs = require('fs');
const fetch = require('cross-fetch');
const globalFunctions = require('./globalfunctions.js');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'skins',
    aliases: ["skin", "sk"],
	description: 'Get list of skins for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        getGodDetails(message, args);
	},
};

async function getGodDetails(message, godName){
    const god = await globalFunctions.getJSONObjectByName(godName, "god");
    if (god) {
        getSkinList(god, message);
    } else {
        message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
    }
}

async function getSkinList(god, message){
    fetch(globalFunctions.generateCreateSessionUrl())
    .then(res => res.json())
    .then(result => {
        sessionId = result.session_id;
        fetch(globalFunctions.generateGodSkinsUrl(sessionId, god.id))
        .then(res => res.json())
        .then(result => {
            parseSkins(result, message);
        });
    });
}

function parseSkins(skins, message) {
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
    message.channel.send(embed);
}