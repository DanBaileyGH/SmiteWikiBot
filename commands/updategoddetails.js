const fetch = require('cross-fetch');
const hirez = require('./hirezapifunctions.js');
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
    await fetch(hirez.generateCreateSessionUrl())
    .then(res => res.json())
    .then(result => {
        console.log(result);
        sessionId = result.session_id;
        console.log(sessionId);
        return sessionId;
    });

    console.log(sessionId);

    fetch(hirez.generateGetGodsURL(sessionId))
    //.then(res => console.log(res))
    .then(res => res.json())
    .then(result => {
        console.log(result);
        const data = JSON.stringify(result, null, 4);
        fs.writeFile('gods.json', data, (err) => {
            if (err) {
                throw err;
            }
        })
        console.log("God details saved to file")
    })
}