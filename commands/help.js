const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'help',
    aliases: ["h", "commands"],
	description: 'Get help with bot commands',
	async execute(message, args) {
        return (await sendHelpMessage())	
    }
}

function sendHelpMessage() {
    let embed = new EmbedBuilder()
    .setTitle(`Commands for SmiteWikiBot`)
    .setTimestamp()
    .setFooter({ text: `Bot Written and Maintained By DiscoFerry#6038` })
    .addFields(
        { name: "**New Build Command**", value: "`?build [godname] (?b or ?[godname])` "+ 
            "- Shows all mentor created builds for the chosen god\n Works without spaces, capitalisation, or apostrophes\n"+
            "**Example usage:** ?b king arthur, ?arthur, ?chang, ?b zhong", 
        inline: false },
        { name: "Wiki Commands", value: "`?god [godname] (?g)` - Shows all stats for the chosen god.\n" +
            "`?abilities [godname] [(1,2,3,4,p,all)] (?a)` - Shows details for abilities of the chosen god.\n" +
            "`?lore [godname] (?l)` - Shows in game lore for the chosen god\n" +
            "`?item [itemname] (?i)` - Shows stats of the chosen item\n" +
            "`?skins [godname] (?sk)` - Shows all skins of chosen god (link, availability, price)\n", 
        inline: false },
        { name: "General Bot Commands", value: "`?invite (?inv)` - Invite SmiteWikiBot to your server!\n" +
            "`?botinfo (?info)` - General information about SmiteWikiBot.\n",
        inline: false }
    )

    return ({embeds: [embed]})
}