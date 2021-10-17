const fetch = require('cross-fetch');
const globalFunctions = require('./globalfunctions.js');
const fs = require('fs');

module.exports = {
	name: 'updategoddetails',
	description: 'updates the god data in gods.json file from api',
	execute(message, args) {
        if (message.author.id == 220922320938729472) {
            updateGodDetails(message);
        } else {
            message.channel.send("command only usable by author");
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

    fetch(globalFunctions.generateGetGodsURL(sessionId))
    .then(res => res.json())
    .then(result => {
        const data = JSON.stringify(result, null, 4);
        fs.writeFile('gods.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("God details saved to file");
        })
    })
}