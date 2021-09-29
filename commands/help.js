const { MessageEmbed} = require('discord.js');

module.exports = {
	name: 'help',
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
    "`w!god [godname]` - Shows all stats for the chosen god.\n" +
    "`w!abilities [godname]` - Shows details for all abilities of the chosen god.\n" +
    "`w!lore [godname]` - Shows in game lore for the chosen god\n" +
    "`w!item [itemname]` - Shows stats of the chosen item",
    false)

    message.channel.send(embed);
}