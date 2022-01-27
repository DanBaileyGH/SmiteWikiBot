const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const { Intents } = require('discord.js')
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const fs = require('fs');
const config = require('./config.json');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const globalFunctions = require('./commands/globalfunctions.js');

client.on('ready', function (evt) {
    console.log('ready');
    client.user.setActivity("?invite | ?help");
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

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();
    let command = client.commands.get(commandName) || client.aliases.get(commandName);

    if (command == null) {
        //checking if user used ?godname command as shorthand for build
        const godName = [message.content.slice(prefix.length).trim().replace(/ /g, "").replace(/’/g, "").replace(/'/g, "").trim().toLowerCase()];
        globalFunctions.findObjectWithShortenedName(godName, "god").then (god => {
            if (god) {
                command = client.commands.get("builds");
                try {
                    console.log(message.author.username + ' used command: ' + commandName);
                    command.execute(message, message.content.slice(prefix.length).trim().split(' '));
                    return;
                } catch (error) {
                    console.log(error);
                    message.reply('error executing command');
                }
            } 
        });
    } else {
        console.log(message.author.username + ' used command: ' + commandName);
        try {
            if(commandName == "addbuild" || commandName == "ab" || commandName == "botinfo" || commandName == "info" || commandName == "feedback") {
                command.execute(message, args, client);
            } else if (["a", "ability", "abilities"].includes(commandName)) {
                const messageObject = await command.execute(args);
                message.channel.send({content: messageObject.content || null, embeds: messageObject.embeds || null, components: messageObject.components || null});
            } else {
                command.execute(message, args);
            }
        } catch (error) {
            console.log(error);
            message.reply('error executing command');
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    //console.log(interaction);
    if (interaction.customId.startsWith("abilities")) {
        let interactionArgs = interaction.customId.split("-");
        interactionArgs.shift();
        try {
            let command = client.commands.get("abilities");
            const messageObject = await command.execute(interactionArgs);
            interaction.update({content: messageObject.content, embeds: messageObject.embeds, components: messageObject.components});
        } catch (err) {
            console.log("you messed up abilities button interaction! error: \n");
            console.log(err);
        }
    } else {
        console.log("recieved interaction you havent sorted you idiot");
    }
});