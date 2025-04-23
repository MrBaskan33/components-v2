const Discord = require("discord.js")
const { JsonDatabase } = require("anonymousdb")
const db = new JsonDatabase({ path: "./utils/database.json" })
const settings = require("../utils/settings.json")

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
   
    let client = interaction.client
    const command = client.commands.get(interaction.commandName)
    if(!command) return
    
    try {
      await command.execute(client, interaction)
    } catch (error) {
      console.error(error)
    }
  }
}
