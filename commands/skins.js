const { EmbedBuilder } = require('discord.js')
const { findObjectWithShortenedName, generateCreateSessionUrl, generateGodSkinsUrl } = require('./globalfunctions.js')

module.exports = {
	name: 'skins',
    aliases: ["skin", "sk"],
	description: 'Get list of skins for chosen god',
	async execute(message, args) {
        if (args == "") { 
            const embed = new EmbedBuilder().setDescription("Please Enter a God")
            return ({ embeds: [embed] }) 
        }
        return (await getGodDetails(args))
	}
}

async function getGodDetails(godName) {
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    if (!god) {
        const embed = new EmbedBuilder().setDescription("God Not Found, Check Your Spelling")
        return ({ embeds: [embed] })
    } 
    return (await getSkinList(god, exactMatch))
}

async function getSkinList(god, exactMatch) {
    const sessionRes = await fetch(generateCreateSessionUrl())
    const sessionData = await sessionRes.json()
    sessionId = sessionData.session_id
    const skinRes = await fetch(generateGodSkinsUrl(sessionId, god.id))
    const skinData = await skinRes.json()
    return (await parseSkins(skinData, exactMatch))
}

function parseSkins(skins, exactMatch) {
    let price = ""
    let link = ""

    let embed = new EmbedBuilder()
    .setTitle(`All Skins For ${skins[0].god_name}`)
    .setThumbnail(skins[0].godIcon_URL)
    .setTimestamp()
    .setFooter({ text: `Data from the Smite API` })

    for (skin of skins) {
        price = `${skin.price_gems} Gems`
        if (skin.price_favor) { 
            price += `\nOR ${[skin.price_favor]} Favor`
        }
        
        link = skin.godSkin_URL ? `[LINK](${skin.godSkin_URL})` : "No Link Available"
              
        if (skin.obtainability == "Normal") {
            embed.addFields({ name: skin.skin_name, value: `${link} \nPrice: ${price}`, inline: true })
        } else if (skin.obtainability == "Exclusive") {
            embed.addFields({ name: skin.skin_name, value: `${link} \nChest/Event Only`, inline: true })
        } else if (skin.obtainability == "Limited") {
            embed.addFields({ name: skin.skin_name, value: `${link} \nLimited Time Only`, inline: true })
        }
    }

    if (exactMatch) {
        return ({ embeds: [embed] })
    }
    return ({ content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed] })
}