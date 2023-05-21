const { MessageEmbed } = require('discord.js')
const { findObjectWithShortenedName } = require('./globalfunctions.js')

module.exports = {
	name: 'lore',
    aliases: ["l", "backstory", "story"],
	description: 'Get lore for chosen god',
	async execute(message, args) {
        if (args.length === 0) { 
            const embed = new MessageEmbed().setDescription("Please Enter a God")
            return ({embeds: [embed]})  
        }
        return (await getGodDetails(args))
	}
}

async function getGodDetails(godName){
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    if (!god) {
        const embed = new MessageEmbed().setDescription("God Not Found, Check Your Spelling")
        return ({embeds: [embed]})
    }
    return (await parseGodLore(god, exactMatch))
}

function parseGodLore(god, exactMatch){
    const loreFormatFixed = god.Lore.replace("\\n\\n", ".\\n\\n").replace("..\\n\\n", ".\\n\\n")
    const loreSplitArray = loreFormatFixed.split("\\n\\n")
    let loreSection = ""
    let loreSectionArray = []
    let loreSectionTitle = ""
    let loreSectionContents = ""
    let embed = new MessageEmbed()
    .setTitle(`Lore For ${god.Name}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(god.godIcon_URL)
    .addField(`Lore for ${god.Name}`, loreSplitArray[0], false)

    for (loreSection of loreSplitArray) {
        loreSectionArray = loreSection.split(".")
        loreSectionTitle = loreSectionArray[0] + "."
        loreSectionContents = loreSectionArray.slice(1).join('.')
        if (loreSectionContents) {
            embed.addField(loreSectionTitle, loreSectionContents, false)
        } else {
            embed.addField(loreSectionTitle, ".", false)
        }
    }
    if (exactMatch) {
        return ({embeds: [embed]})
    }
    return ({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed]})
}