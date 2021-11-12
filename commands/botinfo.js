const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'botinfo',
    aliases: ["info"],
	description: 'Get key information about the bot',
	async execute(message, args, client) {
        let serverCount = await client.guilds.cache.size;
        const embed = new MessageEmbed()
        .setTitle("Info For SmiteWikiBot")
        .setDescription(`Made With Discord.js, Uses The Smite API for God & Ability Information.
        All Builds from the Official Smite Server Mentor Team.
        Server Count: ${serverCount}.
        Written and Maintained by DiscoFerry#6038 (ID 220922320938729472).
        Source Code at https://github.com/DiscoFerry/SmiteWikiBot.
        Invite Me To Your Server With ?invite`)
        .setFooter("Bot Still a WIP Currently.");
        message.channel.send({embeds: [embed]});
	},
};