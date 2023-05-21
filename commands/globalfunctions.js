const md5 = require("md5")
const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { devId, authKey } = require('../auth.json')
const config = require('../auth.json')

const baseURL = "https://api.smitegame.com/smiteapi.svc/"

const createSessionUrl = "createsessionJson/"
const getGodsUrl = "getgodsjson/"
const getItemsUrl = "getitemsjson/"
const getGodSkinsUrl = "getgodskinsjson/"

function getTimestamp() {
    const timestamp = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3) //funnily enough i did not write this, thanks stack overflow
    return timestamp
}

function createSignature(method, timestamp) {
    const signatureToHash = devId + method + authKey + timestamp
    const hashedSignature = md5(signatureToHash).toString()
    return hashedSignature
}

exports.generateCreateSessionUrl = () => {
    const timestamp = getTimestamp()
    const reqURL = `${baseURL}${createSessionUrl}${devId}/${createSignature("createsession", timestamp)}/${timestamp}`
    return reqURL
}

exports.generateGetGodsURL = (sessionId) => {
    const timestamp = getTimestamp()
    const reqURL = `${baseURL}${getGodsUrl}${devId}/${createSignature("getgods", timestamp)}/${sessionId}/${timestamp}/1`
    return reqURL
}

exports.generateGetItemsURL = (sessionId) => {
    const timestamp = getTimestamp()
    const reqURL = `${baseURL}${getItemsUrl}${devId}/${createSignature("getitems", timestamp)}/${sessionId}/${timestamp}/1`
    return reqURL
}

exports.generateGodSkinsUrl = (sessionId, godId) => {
    const timestamp = getTimestamp()
    const reqURL = `${baseURL}${getGodSkinsUrl}${devId}/${createSignature("getgodskins", timestamp)}/${sessionId}/${timestamp}/${godId}/1`
    return reqURL
}

const getAllObjectsOfType = async (type) => {
    const validTypes = ["god", "item"]
    if (!validTypes.includes(type)) {
        throw new Error(`Not a valid type of object - valid types: ${validTypes}`)
    }
    const objectsData = await fs.readFileSync(`${type}s.json`)
    const objectsList = await JSON.parse(objectsData)
    return(objectsList)
}
module.exports.getAllObjectsOfType = getAllObjectsOfType

exports.findObjectWithShortenedName = async (name, type) => {
    name = processNameString(name.join(" "))
    if (name.length < 2) return
    
    const validTypes = ["god", "item"]
    if (!validTypes.includes(type)) {
        throw new Error(`Not a valid type of object - valid types: ${validTypes}`)
    }

    let objectList = await getAllObjectsOfType(type)
    for (object of objectList) {
        const objectName = type == "god" ? object.Name : object.DeviceName
        const currentObjectName = processNameString(objectName)
        if (currentObjectName == name) {
            let returningObject = {
                object: object,
                exact: true
            }
            if (type == "item") {
                returningObject.objectList = objectList
            }
            return (returningObject)
        }
    }
    
    //didnt find exact match, now looking for abbreviations
    for (object of objectList) {
        const objectName = type == "god" ? object.Name : object.DeviceName
        const currentObjectName = processNameString(objectName)
        if (currentObjectName.includes(name)) {
            let returningObject = {
                object: object,
                exact: false
            }
            if (type == "item") {
                returningObject.objectList = objectList
            }
            return (returningObject)
        }
    }
    return false
}

exports.userHasPerms = (message) => {
    let hasPerms = false
    let serverId = message.guild.id
    if (serverId == config.smiteServerId) {
        if (message.member.roles.cache.some(role => role.id == config.smiteServerPermsRoleId)) {
            hasPerms = true
        }
    } else if (serverId == config.testServerId) {
        if (message.member.roles.cache.some(role => role.id == config.testServerPermsRoleId)) {
            hasPerms = true
        }
    } else {
        const embed = new MessageEmbed().setDescription("You cannot edit builds in this server!")
        return ({embeds: [embed]}) 
    }
    return (hasPerms)
}

const processNameString = (name) => {
    const processedString = name.replace(/ /g, "").replace(/'/g, "").replace(/’/g, "").trim().toLowerCase()
    return processedString
}
module.exports.processNameString = processNameString