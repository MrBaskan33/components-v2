const Discord = require("discord.js")
const settings = require("../utils/settings.json")

module.exports = {
  name: "messageCreate",
  execute(message) {

    if(message.author.bot) return
    if(!message.guild) return
    if(!message.content.startsWith(settings.prefix)) return
    let command = message.content.split(" ")[0]
      .slice(settings.prefix.length)
      .toLowerCase()
    let args = message.content.split(" ").slice(1)
      .map(arg => arg.toLowerCase()) 
    let client = message.client
    let cmd = client.commands.get(command)
    if(!cmd) return

    try {
      cmd.execute(client, message, args)
    } catch (error) {
      console.error(error)
    }
  }
}
