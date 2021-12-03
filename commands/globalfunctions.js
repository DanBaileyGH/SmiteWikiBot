const { time } = require('console');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const fetch = require('cross-fetch');
const { createSign } = require('crypto');
const { get } = require('http');
const md5 = require("md5");
const config = require('./auth.json');
const fs = require('fs');

const devId = config.devId;
const authKey = config.authKey;

const baseURL = "https://api.smitegame.com/smiteapi.svc/";

const createSessionUrl = "createsessionJson/";
const getGodsUrl = "getgodsjson/";
const getItemsUrl = "getitemsjson/";
const getGodSkinsUrl = "getgodskinsjson/"

function getTimestamp() {
    const timestamp = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3) //funnily enough i did not write this, thanks stack overflow
    return timestamp;
}

function createSignature(method, timestamp) {
    const signatureToHash = devId + method + authKey + timestamp;
    const hashedSignature = md5(signatureToHash).toString();
    return hashedSignature;
}

exports.generateCreateSessionUrl=()=>{
    const timestamp = getTimestamp();
    const reqURL = baseURL + createSessionUrl + devId + "/" + createSignature("createsession", timestamp) + "/" + timestamp;
    return reqURL;
}

exports.generateGetGodsURL=(sessionId)=>{
    const timestamp = getTimestamp();
    const reqURL = baseURL + getGodsUrl + devId + "/" + createSignature("getgods", timestamp) + "/" + sessionId + "/" + timestamp + "/1";
    return reqURL;
}

exports.generateGetItemsURL=(sessionId)=>{
    const timestamp = getTimestamp();
    const reqURL = baseURL + getItemsUrl + devId + "/" + createSignature("getitems", timestamp) + "/" + sessionId + "/" + timestamp + "/1";
    return reqURL;
}

exports.generateGodSkinsUrl=(sessionId, godId)=>{
    const timestamp = getTimestamp();
    const reqURL = baseURL + getGodSkinsUrl + devId + "/" + createSignature("getgodskins", timestamp) + "/" + sessionId + "/" + timestamp + "/" + godId + "/1";
    return reqURL;
}

//valid types: god, item
function getAllObjectsOfType(type) {
    let objectsList = [];
    return new Promise(resolve => {
        fs.readFile(`${type}s.json`, 'utf8', (err, data) => {
            if (err) {
                console.log("File read failed: ", err);
                return;
            }
            try {
                dataList = JSON.parse(data);
            } catch (err) {
                console.log("error parsing json string: ", err);
                return;
            }
            dataList.forEach(object => {
                objectsList.push(object);
            });
            resolve(objectsList);
        });
    });
}

//valid types: god, item
async function findObjectWithShortenedName(name, type) {
    name = name.join(" ").replace(/ /g, "").replace(/'/, "").replace(/’/g, "").trim().toLowerCase();
    const validTypes = ["god", "item"];
    if (!validTypes.includes(type)) {
        throw new Error(`Not a valid type of object - valid types: ${validTypes}`)
    }
    if (name == "amc") name = "ahmuzencab"; 
    let objectList = await getAllObjectsOfType(type);
    return new Promise(resolve => {
        let currentObjectName = "";
        objectList.forEach(object => {
            if (type == "god") {
                currentObjectName = object.Name.replace(/ /g, "").replace(/'/g, "").replace(/’/g, "").trim().toLowerCase();
                if (currentObjectName == name) {
                    let godObject = {
                        object: object,
                        exact: true
                    }
                    resolve(godObject);
                }
            } else if (type == "item") {
                currentObjectName = object.DeviceName.replace(/ /g, "").replace(/'/g, "").replace(/’/g, "").trim().toLowerCase();
                if (currentObjectName == name) {
                    let itemObject = {
                        object: object,
                        objectList: objectList,
                        exact: true
                    }
                    resolve(itemObject);
                }
            }
        });
        //didnt find exact match, now looking for abbreviations
        if (name.length < 2) return;
        
        objectList.forEach(object => {
            if (type == "god") {
                currentObjectName = object.Name.replace(/ /g, "").replace(/'/g, "").replace(/’/g, "").trim().toLowerCase();
                if (currentObjectName.includes(name)) {
                    let godObject = {
                        object: object,
                        exact: false
                    }
                    resolve(godObject);
                }
            } else if (type == "item") {
                currentObjectName = object.DeviceName.replace(/ /g, "").replace(/'/g, "").replace(/’/g, "").trim().toLowerCase();
                if (currentObjectName.includes(name)) {
                    let itemObject = {
                        object: object,
                        objectList: objectList,
                        exact: false
                    }
                    resolve(itemObject);
                }
            }
        });
        resolve(false);
    })
}
module.exports.findObjectWithShortenedName = findObjectWithShortenedName;

exports.userHasPerms=(message)=>{
    let hasPerms = false;
    const serverId = message.guild.id;
    return new Promise(resolve => {
        if (serverId == config.smiteServerId) {
            if (message.member.roles.cache.some(role => role.id == config.smiteServerPermsRoleId)) {
                hasPerms = true;
            }
        } else if (serverId == config.testServerId) {
            if (message.member.roles.cache.some(role => role.id == config.testServerPermsRoleId)) {
                hasPerms = true;
            }
        } else {
            const embed = new MessageEmbed().setDescription("You cannot edit builds in this server!");
            message.channel.send({embeds: [embed]}); 
        }
        resolve(hasPerms)
    });
}
