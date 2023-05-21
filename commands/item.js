const { MessageEmbed } = require('discord.js')
const { findObjectWithShortenedName } = require('./globalfunctions.js')

module.exports = {
	name: 'item',
    aliases: ["i"],
	description: 'Get details for chosen item',
	async execute(message, args) {
        if (args.length === 0) { 
            const embed = new MessageEmbed().setDescription("Please Enter an Item")
            return ({embeds: [embed]}) 
        }
        return (await getItemDetails(args))
	}
}

async function getItemDetails(itemName) {
    const itemsObject = await findObjectWithShortenedName(itemName, "item")
    const item = itemsObject.object
    const itemList = itemsObject.objectList
    const exactMatch = itemsObject.exact
    if (!item) {
        const embed = new MessageEmbed().setDescription("Item Not Found, Check Your Spelling")
        return ({embeds: [embed]})
    }
    return (await parseItemDetails(item, itemList, exactMatch))
}

function parseItemDetails(item, itemList, exactMatch) {
    const starterItem = (item.StartingItem ? "Yes" : "No")
    let price = item.Price
    let buildsInto = ""
    let buildsFrom = ""

    let embed = new MessageEmbed()
    .setTitle(`Item Details For ${item.DeviceName}`)
    .setTimestamp()
    .setFooter(`Data from the Smite API`)
    .setThumbnail(item.itemIcon_URL)
        
    .addField(item.DeviceName, item.ShortDesc || "no description", false)
    .addField("Starter Item?", starterItem, true)
    .addField("Item Tier", item.ItemTier.toString(), true)

    for (checkItem of itemList) {
        if (checkItem.ChildItemId == item.ItemId) {
            buildsInto += (checkItem.DeviceName + "\n")
        }
        if ((checkItem.ItemId == item.ChildItemId || checkItem.ItemId == item.RootItemId) && checkItem.ItemId != item.ItemId) {
            buildsFrom += (checkItem.DeviceName + "\n")
            price += checkItem.Price
            if(checkItem.ItemId == item.RootItemId && checkItem.ItemTier != 1) {
                itemList.forEach(newRootItem => {
                    if(newRootItem.ItemId == checkItem.RootItemId && newRootItem.ItemId != checkItem.ItemId) {
                        price += newRootItem.Price
                        buildsFrom += (newRootItem.DeviceName + "\n")
                    }
                })
            }
        }
    }

    if (buildsFrom) {
        embed.addField("Builds From", buildsFrom, true)
    }
    if (buildsInto) {
        embed.addField("Builds Into", buildsInto, true)
    }

    embed.addField("Price", price.toString(), true)
    
    const itemStats = item.ItemDescription.Menuitems
    for (stat of itemStats) {
        embed.addField(stat.Description, stat.Value, true)
    }
    if(item.ItemDescription.SecondaryDescription) {
        embed.addField("Passive", item.ItemDescription.SecondaryDescription, false)
    }

    if (exactMatch) {
        return ({embeds: [embed]})
    }
    return ({content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed]})
}