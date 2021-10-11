const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'lore',
    aliases: ["l", "backstory", "story"],
	description: 'Get lore for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        getGodDetails(message, args);
	},
};

async function getGodDetails(message, godName){
    const god = await globalFunctions.getJSONObjectByName(godName, "god");
    if (god) {
        parseGodLore(god, message);
    } else {
        message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
    }
}

function parseGodLore(god, message){
    console.log(god.Name, god.Pantheon);
    const loreFormatFixed= god.Lore.replace("\\n\\n", ".\\n\\n").replace("..\\n\\n", ".\\n\\n");
    const loreSplitArray = loreFormatFixed.split("\\n\\n");
    let loreSection = "";
    let loreSectionArray = [];
    let loreSectionTitle = "";
    let loreSectionContents = "";
    let embed = new MessageEmbed()
    .setTitle(`Lore For ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    
    .addField(`Lore for ${god.Name}`, loreSplitArray[0], false);
    for (let i = 1; i < loreSplitArray.length - 1; i++) {
        loreSection = loreSplitArray[i];
        loreSectionArray = loreSection.split(".");
        loreSectionTitle = loreSectionArray[0] + ".";
        loreSectionContents = loreSectionArray.slice(1).join('.');
        if (loreSectionContents) {
            embed.addField(loreSectionTitle, loreSectionContents, false);
        } else {
            embed.addField(loreSectionTitle, ".", false);
        }
    }
    
    message.channel.send(embed);
}