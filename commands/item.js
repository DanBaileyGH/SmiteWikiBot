const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { start } = require('repl');

module.exports = {
	name: 'item',
	description: 'Get details for chosen item',
	execute(message, args) {
        getGodDetails(message, args);
	},
};

function getGodDetails(message, itemName){
    let itemFound = false;
    itemName = itemName.join(' ').toLowerCase().replace("'", "").replace(" ", "");
    console.log("a")
    let itemList = "";
    fs.readFile('items.json', 'utf8', (err, itemsData) => {
        if (err) {
            console.log("File read failed: ", err);
            return;
        }
        try {
            itemList = JSON.parse(itemsData);
            console.log("b")
        } catch (err) {
            console.log("error parsing json string: ", err);
            return;
        }
        console.log("c")
        itemList.forEach(item => {
            if (item.DeviceName.toLowerCase().replace("'", "").replace(" ", "") == itemName){
                console.log("d")
                itemFound = true;
                parseItemDetails(item, message, itemList);
                return;
            }   
        });
        if (!itemFound) {
            message.channel.send("Item not found, check your spelling");
        }
    });
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