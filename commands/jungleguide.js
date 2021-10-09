const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'jungleguide',
    aliases: ["jungle"],
	description: 'Get kriegas jungle guide',
	execute(message, args) {
        getJungleMessage(message);
	},
};

function getJungleMessage(message){
    fs.readFile('jungleguide.txt', 'utf8', (err, jungleMessage) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        message.channel.send(new MessageEmbed().setDescription(jungleMessage));
    });
}