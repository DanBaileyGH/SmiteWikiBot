const { GatewayIntentBits, Client, Collection } = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const { findObjectWithShortenedName, processNameString } = require('./commands/globalfunctions.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: ['MESSAGE', 'CHANNEL', 'REACTION']})
client.commands = new Collection()
client.aliases = new Collection()

const prefix = "?"

client.on('ready', function (evt) {
    console.log('ready')
    client.user.setActivity("?invite | ?help")
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    if (command.aliases) {
        for (alias of command.aliases) {
            client.aliases.set(alias, command)
        }
    }
}

client.login(config.BOT_TOKEN)

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix)) return
    
    let args = message.content.slice(prefix.length).trim().split(' ')
    const commandName = args.shift().toLowerCase()
    let command = client.commands.get(commandName) || client.aliases.get(commandName)
    let messageObject
    if (!command) {
        //checking if user used ?godname command as shorthand for build
        const godName = [processNameString(message.content.slice(prefix.length).trim())]
        const god = await findObjectWithShortenedName(godName, "god")
        if (!god) return
        command = client.commands.get("builds")
        console.log(message.author.username + ' used command: ' + command.name)
        messageObject = await command.execute(message, message.content.slice(prefix.length).trim().split(' '))
    } else {
        //user used actual command
        console.log(message.author.username + ' used command: ' + command.name)
        if (command.name == "botinfo") {
            args = [await client.guilds.cache.size]
        }
        messageObject = await command.execute(message, args)
    }
    message.channel.send({ content: messageObject.content || null, embeds: messageObject.embeds || null, components: messageObject.components || null })
        .catch(error => console.log(error)) 
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return
    
    //user clicked a button
    if (interaction.customId.startsWith("abilities")) {
        let interactionArgs = interaction.customId.split("-")
        interactionArgs.shift()
        try {
            let command = client.commands.get("abilities")
            const messageObject = await command.execute(null, interactionArgs)
            interaction.update({content: messageObject.content, embeds: messageObject.embeds, components: messageObject.components})
        } catch (err) {
            console.log("you messed up abilities button interaction! error: \n")
            console.log(err)
        }
    } else {
        console.log("recieved unexpected button interaction")
    }
})