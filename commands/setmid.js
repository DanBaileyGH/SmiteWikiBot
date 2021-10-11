const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'setmid',
    aliases: ["setmid"],
	description: 'Set new mid guide command message',
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
    fs.writeFile('midguide.txt', args.join(" "), (err) => {
        if (err) {
            throw err;
        }
    })
    message.channel.send(new MessageEmbed().setDescription("Mid guide message saved to file"));
}