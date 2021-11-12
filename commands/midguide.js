const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'midguide',
    aliases: ["mid"],
	description: 'Get kriegas mid guide',
	execute(message, args) {
        getMidMessage(message);
	},
};

function getMidMessage(message){
    fs.readFile('midguide.txt', 'utf8', (err, midMessage) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        const embed = new MessageEmbed().setDescription(midMessage);
        message.channel.send({embeds: [embed]});
    });
}