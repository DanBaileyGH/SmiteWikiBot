const fs = require('fs');
const fetch = require('cross-fetch');
const hirez = require('./hirezapifunctions.js');
const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'skins',
    aliases: ["skin", "sk"],
	description: 'Get list of skins for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        getSkinList(message, args);
	},
};

async function getSkinList(message, godName){

    let godId = null;
    let godFound = false;
    godName = godName.join(' ').replace(" ", "").replace("'", "").trim().toLowerCase();
    let godList = "";
    fs.readFile('gods.json', 'utf8', (err, godsData) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        try {
            godList = JSON.parse(godsData);
        } catch (err) {
            console.log("error parsing json string: ", err);
            return;
        }
        godList.forEach(god => {
            //console.log(typeof god.Name);
            if (god.Name.replace(" ", "").replace("'", "").trim().toLowerCase() == godName){
                godFound = true;
                godId = god.id
                return;
            }   
        });
        if (!godFound) {
            message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
        }
    });

    await fetch(hirez.generateCreateSessionUrl())
    .then(res => res.json())
    .then(result => {
        console.log(result);
        sessionId = result.session_id;
        console.log(sessionId);
        return sessionId;
    });

    console.log(sessionId);

    await fetch(hirez.generateGodSkinsUrl(sessionId, godId))
    //.then(res => console.log(res));
    .then(res => res.json())
    .then(result => {
        console.log(result);
        parseSkins(result, message);
    });
}

function parseSkins(skins, message) {
    let price = "";
    let obtainability = "";
    let link = "";
    let embed = new MessageEmbed()
    .setTitle(`All Skins For ${skins[0].god_name}`)
    .setThumbnail(skins[0].godIcon_URL)
    .setTimestamp()
    .setFooter(`Data from the Smite API`);

    skins.forEach(skin => {
        price = `${[skin.price_gems]} Gems`
        if (skin.price_favor != 0) { price += `\nOR ${[skin.price_favor]} Favor`};
        if (skin.godSkin_URL == "") { link = "No Link Available"} else {link = `[LINK](${skin.godSkin_URL})`};
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