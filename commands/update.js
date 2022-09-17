const fetch = require('cross-fetch');
const globalFunctions = require('./globalfunctions.js');
const fs = require('fs');

module.exports = {
	name: 'update',
	description: 'updates the data in gods.json and items.json files from api',
	aliases: ["u"],
    execute(message) {
        if (message.author.id == 220922320938729472) {
            updateGodDetails(message);
        } else {
            message.channel.send({content: "command only usable by author"});
        }
	},
};

async function updateGodDetails(message){
    await fetch(globalFunctions.generateCreateSessionUrl())
    .then(res => res.json())
    .then(result => {
        sessionId = result.session_id;
        return sessionId;
    });

    await fetch(globalFunctions.generateGetGodsURL(sessionId))
    .then(res => res.json())
    .then(result => {
        const data = JSON.stringify(result, null, 4);
        fs.writeFile('gods.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("God details saved to file");
            message.channel.send({content: "God details saved to file"});
        })
    })

    await fetch(globalFunctions.generateGetItemsURL(sessionId))
    .then(res => res.json())
    .then(result => {
        const data = JSON.stringify(result, null, 4);
        fs.writeFile('items.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("Item details saved to file");
            message.channel.send({content: "Item details saved to file"});
        })
    });

    /* TODO - skins.json 
    let skinList = [];
    let godList = await globalFunctions.getAllObjectsOfType("god");
    await godList.forEach(god => {
        fetch(globalFunctions.generateGodSkinsUrl(sessionId, god.id))
        .then(res => res.json())
        .then(result => {
            const data = JSON.stringify(result, null, 4);
            skinList.push(god.Name, [data]);
        })
        return skinList;
    })
    .then(skinList => {
        const data = JSON.stringify(skinList, null, 4);
        fs.writeFile('skins.json', data, (err) => {
            if (err) {
                throw err;
            }
        console.log("Skin details saved to file");
        message.channel.send({content: "Skin details saved to file"});
        });
    });
    */
}