const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const config = require('./auth.json');

module.exports = {
	name: 'setjungle',
    aliases: ["setjungle"],
	description: 'Set new jungle guide command message',
	execute(message, args) {
        let hasPerms = false;
        const serverId = message.guild.id;
        if (serverId == config.smiteServerId) {
            if (message.member.roles.cache.some(role => role.id == config.smiteServerPermsRoleId)) {
                hasPerms = true;
            }
        } else if (serverId == config.testServerId) {
            if (message.member.roles.cache.some(role => role.id == config.testServerPermsRoleId)) {
                hasPerms = true;
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription("You cannot edit builds in this server!")); 
        }
        if (!hasPerms) {
            message.channel.send(new MessageEmbed().setDescription("You do not have permission to do this here!")); 
            return;
        }
        if (args == "") { 
            message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); 
            return;
        }
        setStartsMessage(message, args);
	},
};

function setStartsMessage(message, args){
    fs.writeFile('jungleguide.txt', args.join(" "), (err) => {
        if (err) {
            throw err;
        }
    })
    message.channel.send(new MessageEmbed().setDescription("jungle guide message saved to file"));
}