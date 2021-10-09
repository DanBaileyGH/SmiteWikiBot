const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'setstart',
    aliases: ["setstarts"],
	description: 'Set new starts for all roles',
	execute(message, args) {
        setStartsMessage(message, args);
	},
};

function setStartsMessage(message, args){
    fs.writeFile('starts.txt', args.join(" "), (err) => {
        if (err) {
            throw err;
        }
    })
    message.channel.send(new MessageEmbed().setDescription("Starts message saved to file"));
}