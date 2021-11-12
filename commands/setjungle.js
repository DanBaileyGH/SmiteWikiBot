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
            const embed = new MessageEmbed().setDescription("You do not have permission to do this here!");
            message.channel.send({embeds: [embed]}); 
            return;
        }
        if (args == "") { 
            const embed = new MessageEmbed().setDescription("Please Enter a God");
            message.channel.send({embeds: [embed]}); 
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
    const embed = new MessageEmbed().setDescription("jungle guide message saved to file");
    message.channel.send({embeds: [embed]});
}