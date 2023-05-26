const { EmbedBuilder } = require('discord.js')
const { findObjectWithShortenedName, getButtonRows } = require('./globalfunctions.js')

module.exports = {
	name: 'lore',
    aliases: ["l", "backstory", "story"],
	description: 'Get lore for chosen god',
	async execute(message, args) {
        if (args.length === 0) { 
            const embed = new EmbedBuilder().setDescription("Please Enter a God")
            return ({ embeds: [embed] })  
        }
        return (await getGodDetails(args))
	}
}

async function getGodDetails(godName){
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    if (!god) {
        const embed = new EmbedBuilder().setDescription("God Not Found, Check Your Spelling")
        return ({ embeds: [embed] })
    }
    return (await parseGodLore(god, exactMatch))
}

async function parseGodLore(god, exactMatch){
    const loreFormatFixed = god.Lore.replace("\\n\\n", ".\\n\\n").replace("..\\n\\n", ".\\n\\n")
    const loreSplitArray = loreFormatFixed.split("\\n\\n")
    let loreSection = ""
    let loreSectionArray = []
    let loreSectionTitle = ""
    let loreSectionContents = ""
    let embed = new EmbedBuilder()
    .setTitle(`Lore For ${god.Name}`)
    .setDescription("Formatting may be a bit strange thanks to embed restrictions")
    .setTimestamp()
    .setFooter({ text: `Data from the Smite API` })
    .setThumbnail(god.godIcon_URL)
    .addFields({ name: `Lore for ${god.Name}`, value: loreSplitArray[0], inline: false })

    //loops through lore splitting sections until all are small enough for discord
    let allowedFormat = false 
    while (!allowedFormat) {
        allowedFormat = true
        for (let i = 0; i < loreSplitArray.length; i++) {
            if (loreSplitArray[i].split(".")[0].length > 256) {
                allowedFormat = false
                const index = loreSplitArray[i].indexOf(",")
                const part1 = loreSplitArray[i].substring(0, index) + ","
                const part2 = loreSplitArray[i].substring(index + 1)
                loreSplitArray.splice(i, 1, part1, part2)
            }
        }
    }
    
    for (loreSection of loreSplitArray) {
        loreSectionArray = loreSection.split(".")
        loreSectionTitle = loreSectionArray[0] + "."
        loreSectionContents = loreSectionArray.slice(1).join('.')
        if (loreSectionContents) {
            embed.addFields({ name: loreSectionTitle, value: loreSectionContents, inline: false })
        } else {
            embed.addFields({ name: loreSectionTitle, value: "\u200b", inline: false })
        }
    }

    if (exactMatch) {
        return ({ embeds: [embed], components: await getButtonRows(god.Name) })
    }
    return ({ content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed], components: await getButtonRows(god.Name) })
}