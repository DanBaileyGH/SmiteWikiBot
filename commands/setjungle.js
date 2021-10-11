const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'setjungle',
    aliases: ["setjungle"],
	description: 'Set new jungle guide command message',
	async execute(message, args) {
        let hasPerms = await globalFunctions.userHasPerms(message);
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