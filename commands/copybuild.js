const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { userHasPerms, processNameString, findObjectWithShortenedName } = require('./globalfunctions.js')

/*
 * Command that takes a new build entered by a user with permission, breaks it down into god, role, and item list, 
 * and enters it into the builds list in the builds.json file.
 */
module.exports = {
    name: 'copybuild',
    aliases: ["cb"],
    description: 'Copies build with chosen id to new god',
	async execute(message, args) {
        const hasPerms = await userHasPerms(message)
        if (!hasPerms) {
            const embed = new MessageEmbed().setDescription("You do not have permission to do this here!")
            return ({embeds: [embed]}) 
        }
        if (args.length === 0) { 
            const embed = new MessageEmbed().setDescription("Please Enter a Build ID")
            return ({embeds: [embed]}) 
        }
        return (await findGod(args))
	}
}

async function findGod(args) {
    const buildId = args.shift()

    if (args.length === 0) { 
        const embed = new MessageEmbed().setDescription("Please Enter a God")
        return ({embeds: [embed]}) 
    }

    const godName = [processNameString(args.shift())]
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact 
    if (!god) {
        const embed = new MessageEmbed().setDescription("God Not Found, Check Your Spelling")
        return ({embeds: [embed]})
    }
    return (await addBuild(buildId, god.Name, exactMatch))
}

async function addBuild(buildId, godName, exactMatch) {
    let role
    let items
    let author
    //probably not an efficient way of doing ids but there shouldnt ever be more than like 4-500 builds in this bot
    let usedIds = []
    const buildsData = await fs.readFileSync('builds.json')
    const buildList = JSON.parse(buildsData)
    for (checkingBuild of buildList) {
        usedIds.push(checkingBuild.id)
        if (checkingBuild.id == buildId) {
            role = checkingBuild.role
            items = checkingBuild.items
            author = checkingBuild.author
        }   
    }
    if(!role || !items) {
        const embed = new MessageEmbed().setDescription("Build with that id not found")
        return ({embeds: [embed]})
    }

    let id = 1
    while (true) {
        if (!(usedIds.includes(id))) {
            break
        }
        id++
    }

    buildList.push({
        "id" : id,
        "god" : godName,
        "role" : role,
        "items" : items,
        "author" : author
    })

    await fs.writeFileSync('builds.json', JSON.stringify(buildList, null, 4))
    console.log("Builds saved to file")
    if (exactMatch) {
        const embed = new MessageEmbed().setDescription(`Added new build for ${godName} in role ${role} (id ${id})\nBuild: ${items}`)
        return ({embeds: [embed]})
    }
    const embed = new MessageEmbed().setDescription(`Added new build for ${godName} (partial match for god entered) in role ${role} (id ${id})\nBuild: ${items}`)
    return ({embeds: [embed]})
}