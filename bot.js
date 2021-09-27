const { randomInt } = require('crypto');
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const fs = require('fs');
const { cpuUsage } = require('process');
const config = require('./config.json');
client.commands = new Discord.Collection();

client.on('ready', function (evt) {
    console.log('ready');
    client.user.setActivity("w!help");
});

const prefix = "w!";

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.login(config.BOT_TOKEN)

client.on('message', message => {

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(2).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    console.log(message.author.username + ' used command: ' + commandName);

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('error executing command');
    }
});
