const { randomInt } = require('crypto');
const Discord = require('discord.js');
const { MessageEmbed} = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const fs = require('fs');
const { cpuUsage } = require('process');
const config = require('./config.json');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on('ready', function (evt) {
    console.log('ready');
    client.user.setActivity("?help");
});

const prefix = "?";

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    if (command.aliases) {
        command.aliases.forEach(alias => {
            client.aliases.set(alias, command);
        });
    };
}

client.login(config.BOT_TOKEN)

client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;
    
    let args = message.content.slice(prefix.length).trim().split(' ');
    let commandName = args.shift().toLowerCase();
    let command = client.commands.get(commandName) || client.aliases.get(commandName);
    if (command == null) {
        let godFound = false;
        let godName = message.content.slice(prefix.length).trim().replace(" ", "").replace("'", "").trim().toLowerCase();
        let godList = "";
        fs.readFile('gods.json', 'utf8', (err, godsData) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        try {
            godList = JSON.parse(godsData);
        } catch (err) {
            console.log("error parsing json string: ", err);
            return;
        }
        godList.forEach(god => {
            if (god.Name.replace(" ", "").replace("'", "").trim().toLowerCase() == godName){
                godFound = true;
                command = client.commands.get("builds");
                try {
                    command.execute(message, message.content.slice(prefix.length).trim().split(' '));
                    return;
                } catch (error) {
                    console.error(error);
                    message.reply('error executing command');
                }
                
            }   
        });
        });
    } else {
        console.log(message.author.username + ' used command: ' + commandName);
        try {
            if(commandName == "addbuild" || commandName == "ab" || commandName == "db" || commandName == "deletebuild") {
                console.log("adding or deleting build command so passing client");
                command.execute(message, args, client);
            } else {
                command.execute(message, args);
            }
        } catch (error) {
            console.error(error);
            message.reply('error executing command');
        }
    }
});
