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
    const itemsObject = await globalFunctions.getJSONObjectByName(itemName, "item");
    const item = itemsObject.object;
    const itemList = itemsObject.list;
    if (item) {
        parseItemDetails(item, message, itemList);
    } else {
        message.channel.send(new MessageEmbed().setDescription("Item Not Found, Check Your Spelling"));
    }
}

function parseItemDetails(item, message, itemList){
    console.log(item.DeviceName);
    let starterItem = "Yes";
    if (!item.StartingItem) {
        starterItem = "No";
    }
    let price = item.Price 

    let embed = new MessageEmbed()
    .setTitle(`Item Details For ${item.DeviceName}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(item.itemIcon_URL)
        
    .addField(item.DeviceName, item.ShortDesc, false)
    .addField("Starter Item?", starterItem, true)
    .addField("Item Tier", item.ItemTier, true)

    if(item.ItemTier == 1) {
        let buildsInto = "";
        itemList.forEach(checkItem => {
            if (checkItem.ChildItemId == item.ItemId) {
                buildsInto += (checkItem.DeviceName + "\n");
            }
        });
        if (buildsInto != "") {embed.addField("Buids Into", buildsInto, true)};
        price = item.Price;
    } else if (item.ItemTier == 2) {
        let buildsInto = "";
        let buildsFrom = "";
        itemList.forEach(checkItem => {
            if (checkItem.ChildItemId == item.ItemId) {
                buildsInto += (checkItem.DeviceName + "\n");
            }
            if (checkItem.ItemId == item.ChildItemId || checkItem.ItemId == item.RootItemId) {
                buildsFrom += (checkItem.DeviceName + "\n");
                price += checkItem.Price;
            }
        })
        if (buildsFrom != "") {embed.addField("Buids From", buildsFrom, true)};
        if (buildsInto != "") {embed.addField("Buids Into", buildsInto, true)};
    } else if (item.ItemTier == 3) {
        let buildsFrom = "";
        itemList.forEach(checkItem => {
            if (checkItem.ItemId == item.ChildItemId || checkItem.ItemId == item.RootItemId) {
                buildsFrom += (checkItem.DeviceName + "\n");
                price += checkItem.Price;
            }
        })
        if (buildsFrom != "") {embed.addField("Buids From", buildsFrom, true)};
    }

    embed.addField("Price", price, true)
    
    let itemStats = item.ItemDescription.Menuitems;
    itemStats.forEach(stat => {
        embed.addField(stat.Description, stat.Value, true);
    })
    if(item.ItemDescription.SecondaryDescription != null && item.ItemDescription.SecondaryDescription != "") {
        embed.addField("Passive", item.ItemDescription.SecondaryDescription, false);
    }
    message.channel.send(embed);
}