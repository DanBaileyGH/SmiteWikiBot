const builds = require(`./commands/builds.js`)
const fs = require("fs")
async function checkGods() {
    const objectsData = await fs.readFileSync(`gods.json`)
    const objectsList = await JSON.parse(objectsData)
    for (god of objectsList) {
        const result = await builds.execute({}, [god.Name])
        console.log(god.Name, result.embeds[0].data.fields.length)
    }
}
checkGods()