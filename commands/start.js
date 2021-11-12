const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'start',
    aliases: ["starts"],
	description: 'Get mentor set starts for all roles',
	execute(message, args) {
        getStartsMessage(message);
	},
};

function getStartsMessage(message){
    fs.readFile('starts.txt', 'utf8', (err, startMessage) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        const embed = new MessageEmbed().setDescription(startMessage);
        message.channel.send({embeds: [embed]});
    });
}