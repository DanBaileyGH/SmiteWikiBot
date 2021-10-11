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
    let timestamp = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, -3) //funnily enough i did not write this, thanks stack overflow
    return timestamp;
}

function createSignature(method, timestamp) {
    let signatureToHash = devId + method + authKey + timestamp;
    let hashedSignature = md5(signatureToHash).toString();
    return hashedSignature;
}

exports.generateCreateSessionUrl=()=>{
    let timestamp = getTimestamp();
    let reqURL = baseURL + createSessionUrl + devId + "/" + createSignature("createsession", timestamp) + "/" + timestamp;
    return reqURL;
}

exports.generateGetGodsURL=(sessionId)=>{
    let timestamp = getTimestamp();
    let reqURL = baseURL + getGodsUrl + devId + "/" + createSignature("getgods", timestamp) + "/" + sessionId + "/" + timestamp + "/1";
    return reqURL;
}

exports.generateGetItemsURL=(sessionId)=>{
    let timestamp = getTimestamp();
    let reqURL = baseURL + getItemsUrl + devId + "/" + createSignature("getitems", timestamp) + "/" + sessionId + "/" + timestamp + "/1";
    return reqURL;
}

exports.generateGodSkinsUrl=(sessionId, godId)=>{
    let timestamp = getTimestamp();
    let reqURL = baseURL + getGodSkinsUrl + devId + "/" + createSignature("getgodskins", timestamp) + "/" + sessionId + "/" + timestamp + "/" + godId + "/1";
    return reqURL;
}

//probably better to do this with a dictionary or something but :)
function convertShortenedGodName(godName) {
    switch(godName) {
        case "ao":
            godName = "aokuang";
            break;
        case "kuang":
            godName = "aokuang";
            break;
        case "erlang":
            godName = "erlangshen";
            break;
        case "hachi":
            godName = "hachiman";
            break;
        case "gilga":
            godName = "gilgamesh";
            break;    
        case "jorm":
            godName = "jormungandr";
            break;
        case "arthur":
            godName = "kingarthur";
            break;
        case "ka":
            godName = "kingarthur";
            break;
        case "morgan":
            godName = "morganlefay";
            break;
        case "mlf":
            godName = "morganlefay";
            break;
        case "rat":
            godName = "ratatoskr";
            break;
        case "wukong":
            godName = "sunwukong";
            break;
        case "swk":
            godName = "sunwukong";
            break;
        case "kuku":
            godName = "kukulkan";
            break;
        case "guan":
            godName = "guanyu";
            break; 
        case "zhong":
            godName = "zhongkui";
            break;
        case "xt":
            godName = "xingtian";
            break;
        case "zk":
            godName = "zhongkui";
            break;
        case "morri":
            godName = "themorrigan"
            break;
        case "morrigan":
            godName = "themorrigan"
            break;
        default:
            return godName;
    }
    return godName;
}

exports.getJSONObjectByName=(name, type)=>{
    const validTypes = ["god", "item"];
    if (!validTypes.includes(type)) {
        throw new Error(`Not a valid type of object - valid types: ${validTypes}`)
    }
    let found = false;
    name = name.join(' ').replace(" ", "").replace("'", "").trim().toLowerCase();
    name = convertShortenedGodName(name);
    let list = "";
    let objectName = "";
    return new Promise(resolve => {
        fs.readFile(`${type}s.json`, 'utf8', (err, data) => {
            if (err) {
                console.log("File read failed: ", err);
                return;
            }
            try {
                list = JSON.parse(data);
            } catch (err) {
                console.log("error parsing json string: ", err);
                return;
            }
            list.forEach(object => {
                if (type == "god") {
                    objectName = object.Name.replace(" ", "").replace("'", "").trim().toLowerCase()
                    if (objectName == name){
                        found = true;  
                        resolve(object);
                    }   
                } else if (type == "item") {
                    objectName = object.DeviceName.replace(" ", "").replace("'", "").trim().toLowerCase();
                    if (objectName == name){
                        found = true;  
                        const itemObject = {
                            object,
                            list
                        };
                        resolve(itemObject);
                    }   
                }
            });
            if (!found) {
                resolve(false);
            }
        });
    })
}