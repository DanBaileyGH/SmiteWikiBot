const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { findObjectWithShortenedName } = require('./globalfunctions.js')

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
        if (args.length === 0) { 
            const embed = new MessageEmbed().setDescription("Please Enter a God")
            resolve({embeds: [embed], components: null})
        } 
        let ability = 1
        if (["1", "2", "3", "4", "p", "passive", "all"].includes(args[args.length - 1])) {
            ability = args.pop()
        }
        return (await getAbilityDetails(args, ability))
	}
}

async function getAbilityDetails(godName, ability) {
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    //if no god object found matching the user's inputted name
    if (!god) {
        const embed = new MessageEmbed().setDescription(`God "${godName}" Not Found, Check Your Spelling`)
        return ({embeds: [embed], components: null})
    } 
    return (await parseAbilityDetails(god, exactMatch, ability))
}

async function parseAbilityDetails(god, exactMatch, abilityNum) {
    let embed = new MessageEmbed()
    .setTitle(`Ability Details For ${god.Name}`)
    .setDescription(`For God Stats, Use Command ?god ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    
    if(god.Name == "Merlin"){
        embed.setDescription(`For God Stats, Use Command ?god ${god.Name} \n
        NOTE: Merlin only has his arcane stance abilities on the API`)
    }

    let ability = parseOneAbilityDetails(god, abilityNum)
    embed = addAbilityEmbedField(ability, abilityNum, embed)       
    
    //attaches buttons to change to other ability descriptions in the god's kit
    const row = new MessageActionRow()
    const abilityList = [1, 2, 3, 4, "passive"]
    for (ability of abilityList) {
        row.addComponents (
            new MessageButton()
            .setCustomId(`abilities-${god.Name}-${ability}`)
            .setLabel(ability == "passive" ? "Passive" : `Ability ${ability}`)
            .setStyle('PRIMARY'),
        )
    }
    
    if (exactMatch) {
        return ({embeds: [embed], components: [row]})
    } 
    return ({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed], components: [row]})
}

function parseOneAbilityDetails(god, ability) {
    let godAbility
    if ([0, "p", "passive"].includes(ability)) {
        godAbility = god.Ability_5
        ability = "Passive"
    } else {
        godAbility = god[`Ability_${ability}`]
        ability = `Ability ${ability}`
    }
    
    //building an object with the details of the chosen ability
    let abilityObject = {
        abilityName: ability,
        summary: godAbility.Summary,
        description: godAbility.Description.itemDescription.description,
        stats: godAbility.Description.itemDescription.rankitems,
        cooldown: godAbility.Description.itemDescription.cooldown
    }
    return abilityObject
}

function addAbilityEmbedField(ability, abilityNum, embed) {
    let abilityName = (["p", "passive"].includes(abilityNum) ? "Passive" : `Ability ${abilityNum}`)
    embed.addField(`${abilityName} - ${ability.summary}`, ability.description, false)
    for (stat of ability.stats) {
        if (stat.description.length > 2 && stat.value.length > 2) {
            embed.addField(stat.description, stat.value, true)
        }
    }

    if (!["0", "p", "passive"].includes(abilityNum)) {
        if(ability.cooldown && ability.cooldown != "") {
            embed.addField("Cooldown", ability.cooldown, true)
        } else {
            embed.addField("Cooldown", "None", true)
        }
    }
    return embed
}