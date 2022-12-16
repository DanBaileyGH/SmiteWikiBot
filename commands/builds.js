const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');
const config = require('../auth.json');;
const allowedSmiteServerChannels = ["733765823075713111","759221910990094356"];

/*
 * Command that fetches all builds from the builds.json file for the user's chosen god, and send them in a discord embed.
 */
module.exports = {
	name: 'builds',
    aliases: ["build", "b"],
	description: 'Get mentor set builds for chosen god',
	execute(message, args) {
        //official smite server wanted to limit the build command to a couple of channels, so doing that here.
        if (message.guild.id == config.smiteServerId && !(allowedSmiteServerChannels.includes(message.channel.id))) {
            const embed = new MessageEmbed().setDescription(`Build Command Only Usable in <#733765823075713111>`); //smite server use a bot channel
            message.channel.send({embeds: [embed]}); 
            return;
        }
        if (args == "") { 
            const embed = new MessageEmbed().setDescription("Please Enter a God");
            message.channel.send({embeds: [embed]}); 
            return;
        }
        try {
            getGodForBuild(message, args);
        } catch (err) {
            console.log(err);
        }
	},
};

async function getGodForBuild(message, godName){
    const godObject = await globalFunctions.findObjectWithShortenedName(godName, "god")
    const god = godObject.object;
    const exactMatch = godObject.exact;
    if (god) {
        parseGodBuilds(god, message, exactMatch)
    } else {
        const embed = new MessageEmbed().setDescription("God Not Found, Check Your Spelling");
        message.channel.send({embeds: [embed]});
    }
}

function parseGodBuilds(god, message, exactMatch) {
    let godBuildList = []
    fs.readFile('builds.json', 'utf8', (err, buildsData) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        try {
            buildList = JSON.parse(buildsData);
        } catch (err) {
            console.log("Error parsing json string: ", err);
            return;
        }
        buildList.forEach(build => {
            if (build.god.replace(/ /g, "").replace("'", "").trim().toLowerCase() == god.Name.replace(/ /g, "").replace("'", "").trim().toLowerCase()){
                godBuildList.push(build);
            }   
        });
        if (godBuildList.length == 0) {
            const embed = new MessageEmbed().setDescription("Couldnt find any builds for that god - ask a smite server mod to add one?");
            message.channel.send({embeds: [embed]});
        } else {
            let embed = new MessageEmbed()
            .setTitle(`Mentor Builds for ${god.Name}`)
            .setTimestamp()
            .setFooter(`Builds From the Smite Server Mentors`)
            .setThumbnail(god.godIcon_URL);
            let guideList = [];
            let levelList = [];
            let embedList = [];
            godBuildList.forEach(build => {
                if (build.role != "Guide") {
                    if(build.role == "Levels")
                        levelList.push(build)
                    else
                        embedList.push({"role" : `${build.role}`, "data" : `${build.items} \nID [${build.id}]`});
                } else {
                    guideList.push(build)
                }
            });

            //sorts the builds so they're arranged alphabetically in roles (ADC, Jungle Mid, Solo, Support)
            embedList = embedList.sort((a, b) => {
                if(a.role < b.role)
                    return -1;
            });


            if (guideList.length > 0) {
                guideList.forEach(build => {
                    embedList.push({"role" : `${build.role}`, "data" : `${build.items} \nID [${build.id}]`});
                })
            }
            if (levelList.length > 0){
                levelList.forEach(build => {
                    embedList.push({"role" : `Levelling order : `, "data" : `${build.items} \nID [${build.id}]`});
                })
            }

            embedList.forEach(build => {
                embed.addField(`${build.role}`, `${build.data}`, false);
            });
            
            const catchErr = err => {
                console.log(err)
            }

            if (exactMatch) {
                message.channel.send({embeds: [embed]}).catch(catchErr);
            } else {
                message.channel.send({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed]}).catch(catchErr);
            }
        }
    });
}
