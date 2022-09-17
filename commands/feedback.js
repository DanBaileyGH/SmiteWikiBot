const {MessageEmbed} = require('discord.js');
const feedbackChannelID = 908205929969897544;

module.exports = {
	name: 'feedback',
    aliases: [],
	description: 'Send bot feedback',
	execute(message, args, client) {
        if (args == "") { 
            const embed = new MessageEmbed().setDescription("Please Enter Your Feedback in the Same Message as the Command!");
            message.channel.send({embeds: [embed]}); 
            return;
        } else {
            const feedback = args.join(" ");
            const feedbackMessage = message.author.username + " sent feedback: \n" + feedback;
            const ch = client.channels.cache.find(channel => channel.id == feedbackChannelID);
            ch.send(feedbackMessage);
            message.reply({content: "Thanks for your feedback!"});
        }
    }
};