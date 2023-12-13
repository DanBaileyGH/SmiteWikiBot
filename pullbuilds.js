const { Client, Storage } = require("node-appwrite")
const { awproject, awkey, awbucket} = require("./auth.json")

const client = new Client()
const storage = new Storage(client)
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(awproject).setKey(awkey)

async function getData() {
    const files = await storage.listFiles(awbucket)
    let buildFileId = ""
    for (const file of files.files) {
      if (file.name == "newBuilds.json") {
        buildFileId = file.$id
      }
    }
    const buildsRes = await storage.getFileDownload(awbucket, buildFileId)
    const builds = JSON.parse(buildsRes.toString())
    console.log(builds)
    return builds
}

getData()