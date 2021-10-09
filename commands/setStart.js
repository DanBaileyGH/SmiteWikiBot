const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'setstart',
    aliases: ["setstarts"],
	description: 'Set new starts for all roles',
	execute(message, args) {
        const server = client.guilds.cache.get('733765822127800391')
        const member = server.members.cache.get(message.author.id)
        const hasPerms = member ? member.roles.cache.get('895713618845384724') : false
        if (!hasPerms) {
            message.channel.send(new MessageEmbed().setDescription("You do not have permission to do this!")); 
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
    })
    message.channel.send(new MessageEmbed().setDescription("Starts message saved to file"));
}