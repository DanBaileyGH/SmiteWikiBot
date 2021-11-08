const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'invite',
    aliases: ["inv", "link"],
	description: 'Invite the bot to another server',
	execute(message, args) {
        message.channel.send(new MessageEmbed()
        .setTitle("Invite SmiteWikiBot To Your Server")
        .setURL("https://discord.com/api/oauth2/authorize?client_id=839866838305210368&permissions=274878286912&scope=bot")); 
	},
};