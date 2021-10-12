const fs = require('fs');
const { MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'god',
    aliases: ["g", "champ", "champion", "hero"],
	description: 'Get details for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        getGodDetails(message, args);
	},
};

async function getGodDetails(message, godName){
    const godObject = await globalFunctions.findObjectWithShortenedName(godName, "god")
    const god = godObject.object;
    const exactMatch = godObject.exact;
    if (god) {
        parseGodDetails(god, message, exactMatch);
    } else {
        message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
    }
}

function parseGodDetails(god, message, exactMatch){
    console.log(god.Name, god.Pantheon);
    const onFreeRotation = ((god.OnFreeRotation == "true") ? "Yes" : "No");
    let embed = new MessageEmbed()
    .setTitle(`God Details For ${god.Name}`)
    .setDescription(`For Ability Descriptions, Use Command ?abilities ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)

    .addField(god.Name, god.Title, false)
    .addField("Class", god.Roles, true)
    .addField("Type", god.Type, true)
    .addField("Pantheon", god.Pantheon, true)
    .addField("Attack Speed", `${god.AttackSpeed} (+${((god.AttackSpeedPerLevel / god.AttackSpeed) * 100).toFixed(2)}%)`, true)
    if(god.MagicalPower == 0) {
        embed.addField("Attack Damage", `${god.PhysicalPower} (+${god.PhysicalPowerPerLevel}) 
        + 100% Power`, true);
    } else {
        embed.addField("Attack Damage", `${god.MagicalPower} (+${god.MagicalPowerPerLevel}) 
        + 20% Power\n`, true);
    }
    embed.addField("Attack Progression", god.basicAttack.itemDescription.menuitems[1].value, true)
    .addField("Health", `${god.Health} (+${god.HealthPerLevel})`, true)
    .addField("Mana", `${god.Mana} (+${god.ManaPerLevel})`, true)
    .addField("Movement Speed", god.Speed, true)
    .addField("Physical Protections", `${god.PhysicalProtection} (+ ${god.PhysicalProtectionPerLevel})`, true)
    .addField("Magical Protections", `${god.MagicProtection} (+ ${god.MagicProtectionPerLevel})`, true)
    .addField("‏‏‎ ‎‎", "‏‏‎ ‎", true)
    .addField("Pros", god.Pros.replace(",", ",\n"), true)
    .addField("On Free Rotation", onFreeRotation, true)
    
    if (exactMatch) {
        message.channel.send(embed);
    } else {
        message.channel.send("Couldnt find exact match for what you entered, partial match found:", embed)
    }
}