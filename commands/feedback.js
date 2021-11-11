const {MessageEmbed} = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'feedback',
    aliases: [],
	description: 'Send bot feedback',
	execute(message, args, client) {
        if (args == "") { 
            message.channel.send(new MessageEmbed().setDescription("Please Enter Your Feedback in the Same Message as the Command!")); 
            return;
        } else {
            const feedback = args.join(" ");
            const feedbackMessage = message.author.username + " sent feedback: \n" + feedback;
            const ch = client.channels.cache.find(c => c.id == 908205929969897544);
            ch.send(feedbackMessage);
            message.reply("Thanks for your feedback!");
        }
    }
};