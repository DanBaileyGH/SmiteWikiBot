const fetch = require('cross-fetch');
const hirez = require('./hirezapifunctions.js');
const fs = require('fs');

module.exports = {
	name: 'updateitemdetails',
	description: 'updates the item data in items.json file from api',
	execute(message, args) {
        if (message.author.id == 220922320938729472) {
            updateItemDetails(message);
        } else {
            message.channel.send("command only usable by author");
        }
	},
};

async function updateItemDetails(message){
    await fetch(hirez.generateCreateSessionUrl())
    .then(res => res.json())
    .then(result => {
        sessionId = result.session_id;
        return sessionId;
    });

    fetch(hirez.generateGetItemsURL(sessionId))
    .then(res => res.json())
    .then(result => {
        const data = JSON.stringify(result, null, 4);
        fs.writeFile('items.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("Item details saved to file");
        })
    });
}