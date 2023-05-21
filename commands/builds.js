const fs = require('fs')
const { EmbedBuilder } = require('discord.js')
const { findObjectWithShortenedName, processNameString } = require('./globalfunctions.js')
const config = require('../auth.json')
const allowedSmiteServerChannels = ["733765823075713111","759221910990094356"]

/*
 * Command that fetches all builds from the builds.json file for the user's chosen god, and send them in a discord embed.
 * Level order and role sorting - Kayaya#3081/jdaniel6
 */
module.exports = {
	name: 'builds',
    aliases: ["build", "b"],
	description: 'Get mentor set builds for chosen god',
	async execute(message, args) {
        //official smite server wanted to limit the build command to a couple of channels, so doing that here.
        if (message.guild.id == config.smiteServerId && !(allowedSmiteServerChannels.includes(message.channel.id))) {
            const embed = new EmbedBuilder().setDescription(`Build Command Only Usable in <#733765823075713111>`) //smite server use a bot channel
            return ({embeds: [embed]}) 
        }
        if (args.length === 0) { 
            const embed = new EmbedBuilder().setDescription("Please Enter a God")
            return ({embeds: [embed]}) 
        }
        return (await getGodForBuild(args))
	}
}

async function getGodForBuild(godName) {
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    if (!god) {
        const embed = new EmbedBuilder().setDescription("God Not Found, Check Your Spelling")
        return ({embeds: [embed]})
    }   
    return (await parseGodBuilds(god, exactMatch))
}

async function parseGodBuilds(god, exactMatch) {
    let godBuildList = []
    const buildsData = await fs.readFileSync('builds.json')
    const buildList = await JSON.parse(buildsData)

    for (build of buildList) {
        if (processNameString(build.god) == processNameString(god.Name)) {
            godBuildList.push(build)
        }   
    }
    if (godBuildList.length == 0) {
        const embed = new EmbedBuilder().setDescription("Couldnt find any builds for that god - we will add one soon!")
        return ({embeds: [embed]})
    }

    let embed = new EmbedBuilder()
    .setTitle(`Mentor Builds for ${god.Name}`)
    .setTimestamp()
    .setFooter({ text: `Builds From the Smite Server Mentors` })
    .setThumbnail(god.godIcon_URL)

    let embedList = []
    for (build of godBuildList) {
        embedList.push({"role" : build.role == "Levels" ? `Leveling order` : build.role, "data" : `${build.items} \nID [${build.id}]`})
    }
    //sorts the builds so they're arranged alphabetically in roles (ADC, Jungle, Mid, Solo, Support)
    embedList = embedList.sort((a, b) => {
        if (a.role === 'Guide' && b.role !== 'Guide') {
            return -1
        }
        if (a.role !== 'Guide' && b.role === 'Guide') {
            return 1
        }
        
        if (a.role === 'Leveling order' && b.role !== 'Leveling order') {
            return 1
        }
        if (a.role !== 'Leveling order' && b.role === 'Leveling order') {
            return -1
        }
            
        return a.role.localeCompare(b.role)
    })

    for (build of embedList) {
        embed.addFields({ name: `${build.role}`, value: `${build.data}`, inline: false })
    }
    if (exactMatch) {
        return ({ embeds: [embed] })
    }
    return ({ content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed] })
}
