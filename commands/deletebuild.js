const fs = require('fs')
const { EmbedBuilder } = require('discord.js')
const { userHasPerms } = require('./globalfunctions.js')

module.exports = {
	name: 'deletebuild',
    aliases: ["db", "deleteb", "dbuild", "removebuild"],
	description: 'Delete a specific mentor set build',
	async execute(message, args) {
        const hasPerms = await userHasPerms(message)
        if (!hasPerms) {
            const embed = new EmbedBuilder().setDescription("You do not have permission to do this here!")
            return ({ embeds: [embed] }) 
        }
        if (args.length === 0) { 
            const embed = new EmbedBuilder().setDescription("Please Enter a Build ID")
            return ({ embeds: [embed] }) 
        }
        return (await findBuild(args))
	}
}

async function findBuild(buildId) {
    let buildFound = false
    const buildsData = await fs.readFileSync('builds.json')
    const buildList = await JSON.parse(buildsData)
    for (build of buildList) {
        if (build.id == buildId) {
            buildFound = true
            buildList.splice(buildList.indexOf(build), 1)
            fs.writeFileSync('builds.json', JSON.stringify(buildList, null, 4))
            const embed = new EmbedBuilder().setDescription(`Build id ${build.id} deleted \nid ${build.id} was: ${build.role} ${build.god} build with items: ${build.items}`)
            return ({ embeds: [embed] })
        }
    }
    if (!buildFound) {
        const embed = new EmbedBuilder().setDescription("Couldnt find a build with that id")
        return ({ embeds: [embed] })
    }
}