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
    .addField("Commands", 
    "`w!god [godname] (w!g)` - Shows all stats for the chosen god.\n" +
    "`w!abilities [godname] (w!a)` - Shows details for all abilities of the chosen god.\n" +
    "`w!lore [godname] (w!l)` - Shows in game lore for the chosen god\n" +
    "`w!item [itemname] (w!i)` - Shows stats of the chosen item",
    false)

    message.channel.send(embed);
}