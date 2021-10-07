const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'help',
    aliases: ["h", "commands"],
	description: 'Get help with bot commands',
	execute(message, args) {
        sendHelpMessage(message);
	},
};

function sendHelpMessage(message) {
    let embed = new MessageEmbed()
    .setTitle(`Commands for SmiteWikiBot`)
    .setTimestamp()
    .setFooter(`Bot Written and Maintained By DiscoFerry#6038`)
    .addField("**New Build Command**", "`?build [godname] (?b)` - Shows all mentor created builds for the chosen god\n **Replaces -[god] command** - Works without spaces, capitalisation, or apostrophes\n**Example usage:** w!b king arthur", false)
    .addField("Wiki Commands", 
    "`?god [godname] (?g)` - Shows all stats for the chosen god.\n" +
    "`?abilities [godname] [(1,2,3,4,p,all)] (?a)` - Shows details for abilities of the chosen god.\n" +
    "`?lore [godname] (?l)` - Shows in game lore for the chosen god\n" +
    "`?item [itemname] (?i)` - Shows stats of the chosen item\n" +
    "`?skins [godname] (?sk)` - Shows all skins of chosen god (link, availability, price)\n",
    false)

    message.channel.send(embed);
}