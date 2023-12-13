const fs = require('fs')
async function a () {
    const oldbuildfile = await fs.readFileSync("builds.json")
    const oldbuilds = await JSON.parse(oldbuildfile)
    const newbuildfile = await fs.readFileSync("newbuilds.json")
    const newbuilds = await JSON.parse(newbuildfile)
    let count = 200
    oldbuilds.forEach(build => {
        if (build.role != "Levels") return
        newbuilds.push({
            "id": count,
            "type": "Levels",
            "gods": [build.god],
            "role": "Levels",
            "overview": `${build.god}`,
            "items": build.items
        })
        count++
    })
    await fs.writeFileSync('newbuildscombined.json', JSON.stringify(newbuilds, null, 4))
}
a()