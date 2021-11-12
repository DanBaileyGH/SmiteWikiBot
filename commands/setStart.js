const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'setstart',
    aliases: ["setstarts"],
	description: 'Set new starts for all roles',
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
    fs.writeFile('starts.txt', args.join(" "), (err) => {
        if (err) {
            throw err;
        }
    });
    const embed = new MessageEmbed().setDescription("Starts message saved to file");
    message.channel.send({embeds: [embed]});
}