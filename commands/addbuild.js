const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'addbuild',
    aliases: ["ab"],
	description: 'Add a new mentor set builds for chosen god',
	async execute(message, args, client) {
        let hasPerms = await globalFunctions.userHasPerms(message);
        if (!hasPerms) {
            message.channel.send(new MessageEmbed().setDescription("You do not have permission to do this here!")); 
            return;
        }
        if (args == "") { 
            message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); 
            return;
        }
        findGod(message, args, client);
	},
};

async function findGod(message, args, client){
    const godName = [args.splice(0, 1).join(' ').replace(/ /g, "").replace("'", "").trim().toLowerCase()];
    const role = args.splice(0, 1).join(' ').replace(/ /g, "").replace("'", "").trim().toLowerCase();
    const godObject = await globalFunctions.findObjectWithShortenedName(godName, "god")
    const god = godObject.object;
    const exactMatch = godObject.exact;
    if (god) {
        const items = args.join(" ");
        addBuild(message, items, god.Name, role, client, exactMatch);
    } else {
        message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
    }
}

function addBuild(message, items, godName, role, client, exactMatch) {
    if (role == "") {
        message.channel.send(new MessageEmbed().setDescription("Enter a role!\nValid roles: Jungle, Solo, Mid, ADC, Support, General, Guide\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")); 
        return;
    }
    if (role.toLowerCase() == "adc") {
        role = role.toUpperCase();
    } else {
        role = role.charAt(0).toUpperCase() + role.slice(1);
    }
    if (!(["Jungle", "Solo", "Mid", "ADC", "Support", "General", "Guide"].includes(role))) {
        message.channel.send(new MessageEmbed().setDescription("Invalid role entered \nValid roles: Jungle, Solo, Mid, ADC, Support, General, Guide\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")); 
        return;
    } else {
    }
    if (items.length == 0) {
        message.channel.send(new MessageEmbed().setDescription("Forget to enter a build?\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")); 
        return;
    }
    //probably not an efficient way of doing ids but there shouldnt ever be more than like 4-500 builds in this bot
    let usedIds = new Array();
    let duplicate = false;
    fs.readFile('builds.json', 'utf8', (err, buildsData) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        try {
            buildList = JSON.parse(buildsData);
        } catch (err) {
            console.log("error parsing json string: ", err);
            return;
        }
        buildList.forEach(build => {
            if (build.god == godName && build.role == role && build.items == items) {
                duplicate = true;
                message.channel.send(new MessageEmbed().setDescription(`Build already exactly matches current build with id ${build.id}`));
                return;
            } else {
                usedIds.push(build.id);
            }
        });
        if (duplicate) return;
        let id = 1;
        while (true) { //i know i know
            if (!(usedIds.includes(id))) {
                break;
            }
            id++;
        }
        buildList.push({
            "id" : id,
            "god" : godName,
            "role" : role,
            "items" : items,
            "author" : message.author.username
        });
        const data = JSON.stringify(buildList, null, 4);
        fs.writeFile('builds.json', data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log("Builds saved to file");
                if (exactMatch) {
                    message.channel.send(new MessageEmbed().setDescription(`Added new build for ${godName} in role ${role} (id ${id})\nBuild: ${items}`));
                } else {
                    message.channel.send(new MessageEmbed().setDescription(`Added new build for ${godName} (partial match for god entered) in role ${role} (id ${id})\nBuild: ${items}`));
                }
                const ch = client.channels.cache.find(c => c.id == 895777081630265395);
                ch.send({ files: ["./builds.json"] });
            }
        })
    });
}