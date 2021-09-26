const { time } = require('console');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const fetch = require('cross-fetch');
const { createSign } = require('crypto');
const { get } = require('http');
const md5 = require("md5");
const config = require('./config.json');

const devId = config.devId;
const authKey = config.authKey;

const baseURL = "https://api.smitegame.com/smiteapi.svc/";

const createSessionUrl = "createsessionJson/";
const getGodsUrl = "getgodsjson/";
const getItemsUrl = "getitemsjson/";

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

