const fs = require('fs');
const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'abilities',
    aliases: ["a", "kit"],
	description: 'Get ability details for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        let lastArg = args.pop().toLowerCase();
        if (["1", "2", "3", "4", "p", "passive", "all"].includes(lastArg)) {
            getAbilityDetails(message, args, lastArg)
        } else {
            message.channel.send(new MessageEmbed().setDescription("Please choose an ability to see details of!\n Options: 1, 2, 3, 4, passive (or p), all")); 
            return;
        }
	},
};

function getAbilityDetails(message, godName, ability){
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
                if (ability == "all") {
                    parseAllAbilityDetails(god, message);
                } else {
                    parseOneAbilityDetails(god, message, ability);
                }
                return;
            }   
        });
        if (!godFound) {
            message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
        }
    });
}

function parseAllAbilityDetails(god, message){
    console.log(god.Name, god.Pantheon);
    let embed = new MessageEmbed()
    .setTitle(`Ability Details For ${god.Name}`)
    .setDescription(`For God Stats, Use Command w!god ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    
    if(god.Name == "Merlin"){
        embed.setDescription(`For Ability Descriptions, Use Command w!abilities ${god.Name} \n
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

function parseOneAbilityDetails(god, message, ability) {
    console.log(god.Name, god.Pantheon);
    let embed = new MessageEmbed()
    .setTitle(`Ability Details For ${god.Name}`)
    .setDescription(`For God Stats, Use Command w!god ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    
    if(god.Name == "Merlin"){
        embed.setDescription(`For God Stats, Use Command w!god ${god.Name} \n
        NOTE: Merlin only has his arcane stance abilities on the API`);
    }
    
    //im not happy with the way this works but i dont know how i can edit the actual json field names im looking for with a parameter :/
    if(ability == "p" || ability == "passive") {
        embed.addField(`Passive - ${god.Ability_5.Summary}`, god.Ability_5.Description.itemDescription.description, false)
        god.Ability_5.Description.itemDescription.rankitems.forEach(stat => {
            embed.addField(stat.description, stat.value, true);
        });
    } else if (ability == 1) {
        embed.addField(`Ability 1 - ${god.Ability_1.Summary}`, god.Ability_1.Description.itemDescription.description, false);
        god.Ability_1.Description.itemDescription.rankitems.forEach(stat => {
            embed.addField(stat.description, stat.value, true);
        });
        if(god.Ability_1.Description.itemDescription.cooldown && god.Ability_1.Description.itemDescription.cooldown != "") {
            embed.addField("Cooldown", god.Ability_1.Description.itemDescription.cooldown, true);
        } else {
            embed.addField("Cooldown", "None", true);
        }
    } else if (ability == 2) {
        embed.addField(`Ability 2 - ${god.Ability_2.Summary}`, god.Ability_2.Description.itemDescription.description, false);
        god.Ability_2.Description.itemDescription.rankitems.forEach(stat => {
            embed.addField(stat.description, stat.value, true);
        });
        if(god.Ability_2.Description.itemDescription.cooldown && god.Ability_2.Description.itemDescription.cooldown != "") {
            embed.addField("Cooldown", god.Ability_2.Description.itemDescription.cooldown, true);
        } else {
            embed.addField("Cooldown", "None", true);
        }
    } else if (ability == 3) {
        embed.addField(`Ability 3 - ${god.Ability_3.Summary}`, god.Ability_3.Description.itemDescription.description, false);
        god.Ability_3.Description.itemDescription.rankitems.forEach(stat => {
            embed.addField(stat.description, stat.value, true);
        });
        if(god.Ability_3.Description.itemDescription.cooldown && god.Ability_3.Description.itemDescription.cooldown != "") {
            embed.addField("Cooldown", god.Ability_3.Description.itemDescription.cooldown, true);
        } else {
            embed.addField("Cooldown", "None", true);
        }
    } else if (ability == 4) {
        embed.addField(`Ability 4 - ${god.Ability_4.Summary}`, god.Ability_4.Description.itemDescription.description, false);
        god.Ability_4.Description.itemDescription.rankitems.forEach(stat => {
            embed.addField(stat.description, stat.value, true);
        });
        if(god.Ability_4.Description.itemDescription.cooldown && god.Ability_4.Description.itemDescription.cooldown != "") {
            embed.addField("Cooldown", god.Ability_2.Description.itemDescription.cooldown, true);
        } else {
            embed.addField("Cooldown", "None", true);
        }
    }
    message.channel.send(embed);
}