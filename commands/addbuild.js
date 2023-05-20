const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { userHasPerms, processNameString, findObjectWithShortenedName } = require('./globalfunctions.js')

/*
 * Command that takes a new build entered by a user with permission, breaks it down into god, role, and item list, 
 * and enters it into the builds list in the builds.json file.
 */
module.exports = {
	name: 'addbuild',
    aliases: ["ab"],
	description: 'Add a new mentor set build for chosen god',
	async execute(message, args) {
        const hasPerms = await userHasPerms(message)
        if (!hasPerms) {
            const embed = new MessageEmbed().setDescription("You do not have permission to do this here!")
            return ({embeds: [embed]}) 
        }
        if (args.length === 0) { 
            const embed = new MessageEmbed().setDescription("Please Enter a God")
            return ({embeds: [embed]}) 
        }
        const author = message.author.username
        findGod(args, author)
	}
}

async function findGod(args, author) {
    const godName = [processNameString(args.shift())]
    const godObject = await findObjectWithShortenedName(godName, "god")
    const god = godObject.object
    const exactMatch = godObject.exact
    let role = processNameString(args.shift())
    if (role.toLowerCase() == "adc") {
        role = role.toUpperCase()
    } else {
        role = role.charAt(0).toUpperCase() + role.slice(1)
    }  
    const items = args.join(" ")

    //lots of input checking
    if (!role) {
        const embed = new MessageEmbed().setDescription("Enter a role!\nValid roles: Jungle, Solo, Mid, ADC, Support, General, Guide, Levels\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")
        return ({embeds: [embed]}) 
    }
    if (!god) {
        const embed = new MessageEmbed().setDescription("God Not Found, Check Your Spelling")
        return ({embeds: [embed]})
    }
    if (!(["Jungle", "Solo", "Mid", "ADC", "Support", "General", "Guide", "Levels"].includes(role))) {
        const embed = new MessageEmbed().setDescription("Invalid role entered \nValid roles: Jungle, Solo, Mid, ADC, Support, General, Guide, Levels\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")
        return ({embeds: [embed]}) 
    } 
    if (items.length == 0) {
        const embed = new MessageEmbed().setDescription("Forget to enter a build?\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")
        return ({embeds: [embed]}) 
    }

    addBuild(items, god.Name, role, exactMatch, author)
}

async function addBuild(items, godName, role, exactMatch, author) {
    //probably not an efficient way of doing ids but there shouldnt ever be more than like 4-500 builds in this bot
    let usedIds = []
    const buildsData = await fs.readFileSync('builds.json')
    const buildList = JSON.parse(buildsData)
    for (build of buildList) {
        if (build.god == godName && build.role == role && build.items == items) {
            const embed = new MessageEmbed().setDescription(`Build already exactly matches current build with id ${build.id}`)
            return ({embeds: [embed]})
        } else {
            usedIds.push(build.id)
        }
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