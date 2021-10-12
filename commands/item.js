const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const globalFunctions = require('./globalfunctions.js');

module.exports = {
	name: 'item',
    aliases: ["i"],
	description: 'Get details for chosen item',
	execute(message, args) {
        if (args == "") { message.channel.send(new MessageEmbed().setDescription("Please Enter an Item")); return;}
        getItemDetails(message, args);
	},
};

async function getItemDetails(message, itemName){
    const itemsObject = await globalFunctions.findObjectWithShortenedName(itemName, "item");
    const item = itemsObject.object;
    const itemList = itemsObject.objectList;
    const exactMatch = itemsObject.exact;
    if (item) {
        parseItemDetails(item, message, itemList, exactMatch);
    } else {
        message.channel.send(new MessageEmbed().setDescription("Item Not Found, Check Your Spelling"));
    }
}

function parseItemDetails(item, message, itemList, exactMatch){
    console.log(item.DeviceName);
    const starterItem = (item.StartingItem ? "Yes" : "No");
    let price = item.Price;
    let buildsInto = "";
    let buildsFrom = "";

    let embed = new MessageEmbed()
    .setTitle(`Item Details For ${item.DeviceName}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(item.itemIcon_URL)
        
    .addField(item.DeviceName, item.ShortDesc, false)
    .addField("Starter Item?", starterItem, true)
    .addField("Item Tier", item.ItemTier, true)

    itemList.forEach(checkItem => {
        if (checkItem.ChildItemId == item.ItemId) {
            buildsInto += (checkItem.DeviceName + "\n");
        }
        if (checkItem.ItemId == item.ChildItemId || checkItem.ItemId == item.RootItemId) {
            buildsFrom += (checkItem.DeviceName + "\n");
            price += checkItem.Price;
        }
    })

    if (buildsFrom != "") {
        embed.addField("Builds From", buildsFrom, true)
    };
    if (buildsInto != "") {
        embed.addField("Builds Into", buildsInto, true)
    };

    embed.addField("Price", price, true)
    
    const itemStats = item.ItemDescription.Menuitems;
    itemStats.forEach(stat => {
        embed.addField(stat.Description, stat.Value, true);
    })
    if(item.ItemDescription.SecondaryDescription != null && item.ItemDescription.SecondaryDescription != "") {
        embed.addField("Passive", item.ItemDescription.SecondaryDescription, false);
    }

    if (exactMatch) {
        message.channel.send(embed);
    } else {
        message.channel.send("Couldnt find exact match for what you entered, partial match found:", embed)
    }
}