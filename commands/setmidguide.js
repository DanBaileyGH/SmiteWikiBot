const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'setmid',
    aliases: ["setmid"],
	description: 'Set new mid guide command message',
	execute(message, args) {
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