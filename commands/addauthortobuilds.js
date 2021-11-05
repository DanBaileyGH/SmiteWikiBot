const fs = require('fs');

module.exports = {
	name: 'addauthortobuilds',
    aliases: ["fixbuilds"],
	description: 'temp command to add an author to each build',
	execute(message, args) {
        fixBuilds(message);
	},
};

function fixBuilds(message) {
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
        newBuildList = []
        buildList.forEach(build => {
            newBuildList.push({
                "id" : build.id,
                "god" : build.god,
                "role" : build.role,
                "items" : build.items,
                "author" : "predates author tracking"
            });
        });
        const data = JSON.stringify(newBuildList, null, 4);
        fs.writeFile('builds.json', data, (err) => {
            if (err) {
                throw err;
            } else {
                console.log("Builds saved to file");
            }
        });
        message.reply("added author field to all builds");
    });
}
