const fs = require('fs');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'addbuild',
    aliases: ["ab", "addb", "abuild"],
	description: 'Add a new mentor set builds for chosen god',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter a God")); return;}
        findGod(message, args);
	},
};

function findGod(message, args) {
    let godFound = false;
    let godName = args.splice(0, 1).join(' ').replace(" ", "").replace("'", "").trim().toLowerCase();
    let role = args.splice(0, 1).join(' ').replace(" ", "").replace("'", "").trim().toLowerCase();
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
            //console.log(typeof god.Name);
            if (god.Name.replace(" ", "").replace("'", "").trim().toLowerCase() == godName){
                godFound = true;
                let items = args.join(" ");
                addBuild(message, items, god.Name, role);
            }   
        });
        if (!godFound) {
            message.channel.send(new MessageEmbed().setDescription("God Not Found, Check Your Spelling"));
        }
    });
}

function addBuild(message, items, godName, role) {
    if (role == "") {message.channel.send(new MessageEmbed().setDescription("Enter a role!\nValid roles: Jungle, Solo, Mid, ADC, Support, General\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")); return;}
    if (role.toLowerCase() == "adc") {
        role = role.toUpperCase;
    } else {
        role = role.charAt(0).toUpperCase() + role.slice(1);
    }
    console.log(role);
    if (!(["Jungle", "Solo", "Mid", "ADC", "Support", "General"].includes(role))) {
        message.channel.send(new MessageEmbed().setDescription("Invalid role entered \nValid roles: Jungle, Solo, Mid, ADC, Support, General\nExample full command: ?ab thor jungle build, here, (can use) any, [punctuation] or, (format)")); 
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
            //console.log(typeof god.Name);
            if (build.god == godName && build.role == role && build.items == items) {
                duplicate = true;
                message.channel.send(new MessageEmbed().setDescription(`Build already exactly matches current build with id ${build.id}`))
                return;
            } else {
                usedIds.push(build.id);
            }
        });
        if (duplicate) {return;}
        console.log(usedIds);
        let id = 1;
        while (true) { //i know i know
            if (!(usedIds.includes(id))) {
                break;
            }
            id++
        }
        //console.log(buildList);
        console.log(usedIds);
        buildList.push({
            "id" : id,
            "god" : godName,
            "role" : role,
            "items" : items
        })
        const data = JSON.stringify(buildList, null, 4);
        fs.writeFile('builds.json', data, (err) => {
            if (err) {
                throw err;
            }
        })
        console.log("Builds saved to file")
        message.channel.send(new MessageEmbed().setDescription(`Added new build for ${godName} in role ${role} (id ${id})\nItems: ${items}`));
    });
}