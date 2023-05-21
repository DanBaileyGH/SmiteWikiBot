const { MessageEmbed } = require('discord.js')

/*
 * Command that sends an embed message containing key information about the bot.
 */
module.exports = {
	name: 'botinfo',
    aliases: ["info"],
	description: 'Get key information about the bot',
	async execute(message, args) {
        let serverCount = args[0]
        const embed = new MessageEmbed()
        .setTitle("Info For SmiteWikiBot")
        .setDescription(`Made With Discord.js, Uses The Smite API for God & Ability Information.\nAll Builds from the Official Smite Server Mentor Team.\nServer Count: ${serverCount}.\nInvite Me To Your Server With ?invite`)
        return ({embeds: [embed]})
	}
}
