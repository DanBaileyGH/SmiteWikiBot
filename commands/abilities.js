const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

/*
 * Command that finds the details of a chosen god's ability, adds the details of that ability
 * to a discord embed, and sends that in the same channel as the original command, along with
 * discord buttons that the user can use to see other abilities of the same god.
 */
module.exports = {
	name: 'abilities',
    aliases: ["a", "ability"],
	description: 'Get ability details for chosen god',
	async execute(args) {
        return new Promise(resolve => {
            let lastArg = "1";
            if (args == "") { 
                const embed = new MessageEmbed().setDescription("Please Enter a God");
                resolve({embeds: [embed], components: null});
            } 
            if (args.length == 1) {
                console.log("No ability number entered");
            } else {
                lastArg = args.pop().toLowerCase();
                if (!["1", "2", "3", "4", "p", "passive", "all"].includes(lastArg)) {
                    console.log("invalid ability number entered");
                    lastArg = "1";
                }
            }
            try {
                resolve(getAbilityDetails(args, lastArg));
            } catch (err) {
                console.log(err);
            }
        });
	},
};

/**
 * Validates the selected god matches a god found in the API and passes the god object to the parsing function.
 * @async
 * @param {string[]} godName - Array containing the command args that make up the entered god's name.
 * @param {string} ability - Name of the chosen ability, at this point will be one of [1, 2, 3, 4, p, passive].
 * @returns {Promise} - Promise that resolves with either the data for the found god, or an error message.
 */
async function getAbilityDetails(godName, ability) {
    const godObject = await globalFunctions.findObjectWithShortenedName(godName, "god");
    const god = godObject.object;
    const exactMatch = godObject.exact;
    //if no god object found matching the user's inputted name
    if (!god) {
        const embed = new MessageEmbed().setDescription(`God "${godName}" Not Found, Check Your Spelling`);
        return new Promise(resolve => {
            resolve({embeds: [embed], components: null});
        });
    } else {
        const result = await parseAbilityDetails(god, exactMatch, ability);
        return new Promise(resolve => {
            resolve(result);
        });
    }
}

/**
 * Turns the chosen god's chosen abilities data into a discord embed and sends it in the original message's channel.
 * @param {object} god - Object containing the chosen gods data from the API.
 * @param {boolean} exactMatch - Did the user enter the exact god's name (true) or a shortened version (false).
 * @param {string} abilityNum - Name of the chosen ability, at this point will be one of [1, 2, 3, 4, p, passive].
 * @returns {Promise} - Promise that resolves with either a discord embed of the ability details to send, or an error message.
 */
async function parseAbilityDetails(god, exactMatch, abilityNum) {
    return new Promise(resolve => {
        let embed = new MessageEmbed()
        .setTitle(`Ability Details For ${god.Name}`)
        .setDescription(`For God Stats, Use Command ?god ${god.Name}`)
        .setTimestamp()
        .setFooter(`Data from the Smite API`)
        .setThumbnail(god.godIcon_URL);
        
        if(god.Name == "Merlin"){
            embed.setDescription(`For God Stats, Use Command ?god ${god.Name} \n
            NOTE: Merlin only has his arcane stance abilities on the API`);
        }

        let ability = parseOneAbilityDetails(god, abilityNum);
        embed = addAbilityEmbedField(ability, abilityNum, embed);       
        
        //attaches buttons to change to other ability descriptions in the god's kit
        const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setCustomId(`abilities-${god.Name}-1`)
			.setLabel('Ability 1')
			.setStyle('PRIMARY'),

            new MessageButton()
			.setCustomId(`abilities-${god.Name}-2`)
			.setLabel('Ability 2')
			.setStyle('PRIMARY'),

            new MessageButton()
			.setCustomId(`abilities-${god.Name}-3`)
			.setLabel('Ability 3')
			.setStyle('PRIMARY'),

            new MessageButton()
			.setCustomId(`abilities-${god.Name}-4`)
			.setLabel('Ability 4')
			.setStyle('PRIMARY'),

            new MessageButton()
			.setCustomId(`abilities-${god.Name}-p`)
			.setLabel('Passive')
			.setStyle('PRIMARY'),
		);

        if (exactMatch) {
            resolve({embeds: [embed], components: [row]});
        } else {
            resolve({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed], components: [row]});
        }
    });
}

/**
 * Retrieves the particular chosen ability from the gods overall data.
 * @param {object} god - Object containing the chosen gods data from the API.
 * @param {string} ability - Name of the chosen ability, at this point will be one of [1, 2, 3, 4, p, passive].
 * @returns {object} - Object containing just the details of the chosen ability of the god.
 */
function parseOneAbilityDetails(god, ability) {
    let godAbility = 0;
    if ([0, "0", "p", "passive"].includes(ability)) {
        godAbility = god.Ability_5;
        ability = "Passive";
    } else if (ability == "1") {
        godAbility = god.Ability_1;
        ability = "Ability 1";
    } else if (ability == "2") {
        godAbility = god.Ability_2;
        ability = "Ability 2";
    } else if (ability == "3") {
        godAbility = god.Ability_3;
        ability = "Ability 3";
    } else if (ability == "4") {
        godAbility = god.Ability_4;
        ability = "Ability 4";
    }
    
    //building an object with the details of the chosen ability
    let abilityObject = {
        abilityName: ability,
        summary: godAbility.Summary,
        description: godAbility.Description.itemDescription.description,
        stats: godAbility.Description.itemDescription.rankitems,
        cooldown: godAbility.Description.itemDescription.cooldown
    }

    return abilityObject;
}

/**
 * Turns the chosen god's chosen abilities data into a discord embed and sends it in the original message's channel.
 * @param {object} ability - Object with all details of chosen ability.
 * @param {string} abilityNum - Name of the chosen ability, at this point will be one of [1, 2, 3, 4, p, passive].
 * @param {object} embed - The discord embed that needs to have the ability details added to it to send.
 * @returns {object} - The embed given as a parameter, now containing all the ability details as fields.
 */
function addAbilityEmbedField(ability, abilityNum, embed) {
    let abilityName = (["p", "passive"].includes(abilityNum) ? "Passive" : `Ability ${abilityNum}`);
    embed.addField(`${abilityName} - ${ability.summary}`, ability.description, false);
    ability.stats.forEach(stat => {
        if (stat.description != " " && stat.value != " ") {
            embed.addField(stat.description, stat.value, true);
        }
        
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