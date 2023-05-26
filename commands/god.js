const { EmbedBuilder } = require('discord.js')
const { findObjectWithShortenedName, getButtonRows } = require('./globalfunctions.js')

module.exports = {
	name: 'god',
    aliases: ["g", "champ", "champion", "hero"],
	description: 'Get details for chosen god',
	async execute(message, args) {
        if (args.length === 0) { 
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
    return (await parseGodDetails(god, exactMatch))
}

async function parseGodDetails(god, exactMatch) {
    const onFreeRotation = ((god.OnFreeRotation == "true") ? "Yes" : "No")
    let embed = new EmbedBuilder()
    .setTitle(`God Details For ${god.Name}`)
    .setTimestamp()
    .setFooter({ text: `Data from the Smite API` })
    .setThumbnail(god.godIcon_URL)

    .addFields(
        { name: god.Name, value: god.Title, inline: false },
        { name: "Class", value: god.Roles, inline: true },
        { name: "Type", value: god.Type, inline: true },
        { name: "Pantheon", value: god.Pantheon, inline: true },
        { name: "Attack Speed", value: `${god.AttackSpeed} (+${((god.AttackSpeedPerLevel / god.AttackSpeed) * 100).toFixed(2)}%)`, inline: true } 
    )
    if(god.PhysicalPower) {
        embed.addFields({ name: "Attack Damage", value: `${god.PhysicalPower} (+${god.PhysicalPowerPerLevel}) + 100% Power`, inline: true })
    } else {
        embed.addFields({ name: "Attack Damage", value: `${god.MagicalPower} (+${god.MagicalPowerPerLevel}) + 20% Power`, inline: true })
    }
    embed.addFields(
        { name: "Attack Progression", value: god.basicAttack.itemDescription.menuitems[1].value, inline: true },
        { name: "Health", value: `${god.Health} (+${god.HealthPerLevel})`, inline: true },
        { name: "Mana", value: `${god.Mana} (+${god.ManaPerLevel})`, inline: true },
        { name: "Movement Speed", value: god.Speed.toString(), inline: true },
        { name: "Physical Protections", value: `${god.PhysicalProtection} (+ ${god.PhysicalProtectionPerLevel})`, inline: true },
        { name: "Magic Protections", value: `${god.MagicProtection} (+ ${god.MagicProtectionPerLevel})`, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Pros", value: god.Pros.replace(",", ",\n"), inline: true },
        { name: "On Free Rotation", value: onFreeRotation, inline: true },
        { name: "\u200b", value: "\u200b", inline: true }
    )

    if (exactMatch) {
        return ({ embeds: [embed], components: await getButtonRows(god.Name) })
    }
    return ({ content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed], components: await getButtonRows(god.Name)  })
}