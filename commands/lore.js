const fs = require('fs');
const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'lore',
	description: 'Get lore for chosen god',
	execute(message, args) {
        getGodDetails(message, args);
	},
};

function getGodDetails(message, godName){

    let godFound = false;
    godName = godName.join(' ').toLowerCase();
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
            if (god.Name.toLowerCase() == godName){
                godFound = true;
                parseGodDetails(god, message);
                return;
            }   
        });
        if (!godFound) {
            message.channel.send("God not found, check your spelling");
        }
    });
}

function parseGodDetails(god, message){
    console.log(god.Name, god.Pantheon);
    let onFreeRotation = "Yes";
    if (god.onFreeRotation == "") {
        onFreeRotation = "No";
    }
    let loreFormatFixed= god.Lore.replace("\\n\\n", ".\\n\\n").replace("..\\n\\n", ".\\n\\n");
    let loreSplitArray = loreFormatFixed.split("\\n\\n");
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
        embed.addField(loreSectionTitle, loreSectionContents, false);
    }
    
    message.channel.send(embed);
}