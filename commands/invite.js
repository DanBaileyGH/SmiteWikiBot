const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'invite',
    aliases: ["inv", "link"],
	description: 'Invite the bot to another server',
	execute(message, args) {
        const embed = new MessageEmbed()
        .setTitle("Invite SmiteWikiBot To Your Server")
        .setURL("https://discord.com/api/oauth2/authorize?client_id=839866838305210368&permissions=274878286912&scope=bot")

        return ({embeds: [embed]})
	}
};