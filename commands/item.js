const { EmbedBuilder } = require('discord.js')
const { findObjectWithShortenedName } = require('./globalfunctions.js')

module.exports = {
	name: 'item',
    aliases: ["i"],
	description: 'Get details for chosen item',
	async execute(message, args) {
        if (args.length === 0) { 
            const embed = new EmbedBuilder().setDescription("Please Enter an Item")
            return ({ embeds: [embed] }) 
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
        const embed = new EmbedBuilder().setDescription("Item Not Found, Check Your Spelling")
        return ({ embeds: [embed] })
    }
    return (await parseItemDetails(item, itemList, exactMatch))
}

function parseItemDetails(item, itemList, exactMatch) {
    const starterItem = (item.StartingItem ? "Yes" : "No")
    let price = item.Price
    let buildsInto = ""
    let buildsFrom = ""

    let embed = new EmbedBuilder()
    .setTitle(`Item Details For ${item.DeviceName}`)
    .setTimestamp()
    .setFooter({ text: `Data from the Smite API` })
    .setThumbnail(item.itemIcon_URL)
        
    .addFields(
        { name: item.DeviceName, value: item.ShortDesc || "no description", inline: false },
        { name: "Starter Item?", value: starterItem, inline: true },
        { name: "Item Tier", value: item.ItemTier.toString(), inline: true }
    )

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
        embed.addFields({ name: "Builds From", value: buildsFrom, inline: true })
    }
    if (buildsInto) {
        embed.addFields({ name: "Builds Into", value: buildsInto, inline: true })
    }

    embed.addFields({ name: "Price", value: price.toString(), inline: true })
    
    const itemStats = item.ItemDescription.Menuitems
    for (stat of itemStats) {
        embed.addFields({ name: stat.Description, value: stat.Value, inline: true })
    }
    if(item.ItemDescription.SecondaryDescription) {
        embed.addFields({ name: "Passive", value: item.ItemDescription.SecondaryDescription, inline: false })
    }

    if (exactMatch) {
        return ({ embeds: [embed] })
    }
    return ({ content: "Couldnt find exact match for what you entered, partial match found:", embeds: [embed] })
}