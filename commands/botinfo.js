const {MessageEmbed} = require('discord.js');

/*
 * Command that sends an embed message containing key information about the bot.
 */
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
    Invite Me To Your Server With ?invite`)
        .setFooter("Bot Still a WIP Currently.");
        
        const catchErr = err => {
            console.log(err)
        }
        
        message.channel.send({embeds: [embed]}).catch(catchErr);
	},
};