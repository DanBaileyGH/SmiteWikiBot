const fs = require('fs')
const globalFunctions = require('./globalfunctions.js')

module.exports = {
	name: 'update',
	description: 'updates the data in gods.json and items.json files from api',
	aliases: ["u"],
    async execute(message) {
        if (!message.author.id == 220922320938729472) {
            return ({content: "command only usable by author"}) 
        }
        return (await updateGodDetails(message))
	}
}

async function updateGodDetails() {
    const sessionRes = await fetch(globalFunctions.generateCreateSessionUrl())
    const sessionData = await sessionRes.json()
    const sessionId = sessionData.session_id

    const godsRes = await fetch(globalFunctions.generateGetGodsURL(sessionId))
    const godsData = await godsRes.json()
    await fs.writeFileSync('gods.json', JSON.stringify(godsData, null, 4))        

    const itemsRes = await fetch(globalFunctions.generateGetItemsURL(sessionId))
    const itemsData = await itemsRes.json()
    await fs.writeFileSync('items.json', JSON.stringify(itemsData, null, 4))
    return ({content: "Item and God details saved to file"})

    /* TODO - skins.json 
    let skinList = []
    let godList = await globalFunctions.getAllObjectsOfType("god")
    await godList.forEach(god => {
        fetch(globalFunctions.generateGodSkinsUrl(sessionId, god.id))
        .then(res => res.json())
        .then(result => {
            const data = JSON.stringify(result, null, 4)
            skinList.push(god.Name, [data])
        })
        return skinList
    })
    .then(skinList => {
        const data = JSON.stringify(skinList, null, 4)
        fs.writeFile('skins.json', data, (err) => {
            if (err) {
                throw err
            }
        console.log("Skin details saved to file")
        message.channel.send({content: "Skin details saved to file"})
        })
    })
    */
}