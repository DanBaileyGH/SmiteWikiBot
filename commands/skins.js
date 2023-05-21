const { MessageEmbed } = require('discord.js')
const { findObjectWithShortenedName, generateCreateSessionUrl, generateGodSkinsUrl } = require('./globalfunctions.js')

module.exports = {
	name: 'skins',
    aliases: ["skin", "sk"],
	description: 'Get list of skins for chosen god',
	async execute(message, args) {
        if (args == "") { 
            const embed = new MessageEmbed().setDescription("Please Enter a God")
            return ({embeds: [embed]}) 
        }
        return (await getGodDetails(args))
	}
}

async function getGodDetails(godName) {
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    if (!god) {
        const embed = new MessageEmbed().setDescription("God Not Found, Check Your Spelling")
        return ({embeds: [embed]})
    } 
    return (await getSkinList(god, exactMatch))
}

async function getSkinList(god, exactMatch) {
    const sessionRes = await fetch(generateCreateSessionUrl())
    const sessionData = await sessionRes.json()
    sessionId = sessionData.session_id
    const skinRes = await fetch(generateGodSkinsUrl(sessionId, god.id))
    const skinData = await skinRes.json()
    parseSkins(skinData, exactMatch)
}

function parseSkins(skins, exactMatch) {
    let price = ""
    let link = ""

    let embed = new MessageEmbed()
    .setTitle(`All Skins For ${skins[0].god_name}`)
    .setThumbnail(skins[0].godIcon_URL)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)

    for (skin of skins) {
        price = `${skin.price_gems} Gems`
        if (skin.price_favor) { 
            price += `\nOR ${[skin.price_favor]} Favor`
        }
        
        link = skin.godSkin_URL ? `[LINK](${skin.godSkin_URL})` : "No Link Available"
              
        if (skin.obtainability == "Normal") {
            embed.addField(skin.skin_name, `${link} \nPrice: ${price}`, true)
        } else if (skin.obtainability == "Exclusive") {
            embed.addField(skin.skin_name, `${link} \nChest/Event Only`, true)
        } else if (skin.obtainability == "Limited") {
            embed.addField(skin.skin_name, `${link} \nLimited Time Only`, true)
        }
    }

    if (exactMatch) {
        return ({embeds: [embed]})
    }
    return ({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed]})
}