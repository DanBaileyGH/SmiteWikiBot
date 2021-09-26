const fs = require('fs');
const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'god',
	description: 'Get details for chosen god',
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
    let embed = new MessageEmbed()
    .setTitle(`God Details For ${god.Name}`)
    .setDescription(`For Ability Descriptions, Use Command w!abilities ${god.Name}`)
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
    
    message.channel.send(embed);
}