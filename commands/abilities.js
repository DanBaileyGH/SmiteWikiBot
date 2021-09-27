const fs = require('fs');
const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'abilities',
	description: 'Get ability details for chosen god',
	execute(message, args) {
        getAbilityDetails(message, args);
	},
};

function getAbilityDetails(message, godName){

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
                parseAbilityDetails(god, message);
                return;
            }   
        });
        if (!godFound) {
            message.channel.send("God not found, check your spelling");
        }
    });
}

function parseAbilityDetails(god, message){
    console.log(god.Name, god.Pantheon);
    let onFreeRotation = "Yes";
    if (god.onFreeRotation == "") {
        onFreeRotation = "No";
    }
    let embed = new MessageEmbed()
    .setTitle(`Ability Details For ${god.Name}`)
    .setDescription(`For God Stats, Use Command w!god ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    
    if(god.Name == "Merlin"){
        embed.setDescription(`For God Stats, Use Command w!abilities ${god.Name} \n
        NOTE: Merlin only has his arcane stance abilities on the API`);
    }
    
    embed.addField(`Passive - ${god.Ability_5.Summary}`, god.Ability_5.Description.itemDescription.description, false)
    god.Ability_5.Description.itemDescription.rankitems.forEach(stat => {
        embed.addField(stat.description, stat.value, true);
    });
    
    embed.addField(`Ability 1 - ${god.Ability_1.Summary}`, god.Ability_1.Description.itemDescription.description, false);
    god.Ability_1.Description.itemDescription.rankitems.forEach(stat => {
        embed.addField(stat.description, stat.value, true);
    });
    if(god.Ability_1.Description.itemDescription.cooldown && god.Ability_1.Description.itemDescription.cooldown != "") {
        embed.addField("Cooldown", god.Ability_1.Description.itemDescription.cooldown, true);
    } else {
        embed.addField("Cooldown", "None", true);
    }
    
    embed.addField(`Ability 2 - ${god.Ability_2.Summary}`, god.Ability_2.Description.itemDescription.description, false);
    god.Ability_2.Description.itemDescription.rankitems.forEach(stat => {
        embed.addField(stat.description, stat.value, true);
    });
    if(god.Ability_2.Description.itemDescription.cooldown && god.Ability_2.Description.itemDescription.cooldown != "") {
        embed.addField("Cooldown", god.Ability_2.Description.itemDescription.cooldown, true);
    } else {
        embed.addField("Cooldown", "None", true);
    }

    embed.addField(`Ability 3 - ${god.Ability_3.Summary}`, god.Ability_3.Description.itemDescription.description, false);
    god.Ability_3.Description.itemDescription.rankitems.forEach(stat => {
        embed.addField(stat.description, stat.value, true);
    });
    if(god.Ability_3.Description.itemDescription.cooldown && god.Ability_3.Description.itemDescription.cooldown != "") {
        embed.addField("Cooldown", god.Ability_3.Description.itemDescription.cooldown, true);
    } else {
        embed.addField("Cooldown", "None", true);
    }

    embed.addField(`Ability 4 - ${god.Ability_4.Summary}`, god.Ability_4.Description.itemDescription.description, false);
    god.Ability_4.Description.itemDescription.rankitems.forEach(stat => {
        embed.addField(stat.description, stat.value, true);
    });
    if(god.Ability_4.Description.itemDescription.cooldown && god.Ability_4.Description.itemDescription.cooldown != "") {
        embed.addField("Cooldown", god.Ability_4.Description.itemDescription.cooldown, true);
    } else {
        embed.addField("Cooldown", "None", true);
    }

    message.channel.send(embed);
}