const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'abilities',
    aliases: ["a", "ability"],
	description: 'Get ability details for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        const lastArg = args.pop().toLowerCase();
        if (["1", "2", "3", "4", "p", "passive", "all"].includes(lastArg)) {
            getAbilityDetails(message, args, lastArg)
        } else {
            message.channel.send(new MessageEmbed().setDescription("Please choose an ability to see details of!\n Options: 1, 2, 3, 4, passive (or p), all")); 
            return;
        }
	},
};


/**
 * Validates the selected god matches a god found in the API and passes the god object to the parsing function.
 * @async
 * @param {object} message - Discord message object that contains the original command.
 * @param {string[]} godName - Array containing the command args that make up the entered god's name.
 * @param {string} ability - Name of the chosen ability, at this point will be one of [1, 2, 3, 4, p, passive].
 */
async function getAbilityDetails(message, godName, ability) {
    const godObject = await globalFunctions.findObjectWithShortenedName(godName, "god")
    const god = godObject.object;
    const exactMatch = godObject.exact;
    if (god) {
        parseAbilityDetails(god, message, exactMatch, ability);
    } else {
        message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
    }
}

/**
 * Turns the chosen god's chosen abilities data into a discord embed and sends it in the original message's channel.
 * @param {object} god - Object containing the chosen gods data from the API.
 * @param {object} message - Discord message object that contains the original command.
 * @param {boolean} exactMatch - Did the user enter the exact god's name (true) or a shortened version (false).
 * @param {string} abilityNum - Name of the chosen ability, at this point will be one of [1, 2, 3, 4, p, passive].
 */
function parseAbilityDetails(god, message, exactMatch, abilityNum){
    let embed = new MessageEmbed()
    .setTitle(`Ability Details For ${god.Name}`)
    .setDescription(`For God Stats, Use Command ?god ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    
    if(god.Name == "Merlin"){
        embed.setDescription(`For God Stats, Use Command ?god ${god.Name} \n
        NOTE: Merlin only has his arcane stance abilities on the API`);
    }

    if (abilityNum == "all") {
        for(i = 0; i < 5; i++) {
            let ability = parseOneAbilityDetails(god, i);
            embed = addAbilityEmbedField(ability, ability.abilityName, embed);
        }
    } else {
        let ability = parseOneAbilityDetails(god, abilityNum);
        embed = addAbilityEmbedField(ability, abilityNum, embed);       
    }
    
    if (exactMatch) {
        message.channel.send(embed);
    } else {
        message.channel.send("Couldnt find exact match for what you entered, partial match found:", embed)
    }
}

function parseOneAbilityDetails(god, ability) {
    let godAbility = 0;
    if ([0, "0", "p", "passive"].includes(ability)) {
        godAbility = god.Ability_5;
        ability = "Passive";
    } else if (ability == "1") {
        godAbility = god.Ability_1;
        ability = "Ability 1"
    } else if (ability == "2") {
        godAbility = god.Ability_2;
        ability = "Ability 2"
    } else if (ability == "3") {
        godAbility = god.Ability_3;
        ability = "Ability 3"
    } else if (ability == "4") {
        godAbility = god.Ability_4;
        ability = "Ability 4"
    }
    
    let abilityObject = {
        abilityName: ability,
        summary: godAbility.Summary,
        description: godAbility.Description.itemDescription.description,
        stats: godAbility.Description.itemDescription.rankitems,
        cooldown: godAbility.Description.itemDescription.cooldown
    }

    return abilityObject;
}

function addAbilityEmbedField(ability, abilityNum, embed) {
    let abilityName = (["p", "passive"].includes(abilityNum) ? "Passive" : `Ability ${abilityNum}`);
    embed.addField(`${abilityName} - ${ability.summary}`, ability.description, false);
    ability.stats.forEach(stat => {
            embed.addField(stat.description, stat.value, true);
    });
    if (!["0", "p", "passive"].includes(abilityNum)) {
        if(ability.cooldown && ability.cooldown != "") {
            embed.addField("Cooldown", ability.cooldown, true);
        } else {
            embed.addField("Cooldown", "None", true);
        }
    }
    return embed;
}