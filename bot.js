const Discord = require("discord.js")
const fs = require("fs")
const path = require("path")
const { lang, getLocalizations } = require("./utils/language")
const { JsonDatabase } = require("anonymousdb")
const db = new JsonDatabase({ path: "./utils/database.json" })
const emojis = require("./utils/emojis.json")
const settings = require("./utils/settings.json")
const client = new Discord.Client({ intents: [53608189] })
const cooldown = new Map()
    
client.login(settings.token)

fs.readdirSync("./events").forEach(async file => {
  const event = await require(`./events/${file}`)
  if(event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
  console.log(`[${file}] event loaded.`)
})

const commands = []
client.commands = new Discord.Collection()
const loadCommands = (directory, category = "") => {
  fs.readdirSync(directory).forEach(async file => {
    const fullPath = path.join(__dirname, directory, file)
    const stat = fs.lstatSync(fullPath)
    if(stat.isDirectory()) {
      loadCommands(path.join(directory, file), file)
    } else if(file.endsWith('.js')) {
      try {
        const command = await require(fullPath)
        if(command.slash) {
          commands.push(command.data.toJSON());
          client.commands.set(command.data.name, command);
          console.log(category ? `[${category}] (${file}) - slash command loaded.` : `(${file}) slash command loaded.`)
        }
        if(!command.slash) {
          client.commands.set(command.name[0], command);
          console.log(category ? `[${category}] (${file}) - prefix command loaded.` : `(${file}) prefix command loaded.`)
        }
      } catch (error) {
        console.log(`(${file}) command not loaded. Error: ${error.message}`)
      }
    }
  })
}

loadCommands("./commands")

client.once("ready", async () => {
  const rest = new Discord.REST({ version: "10" }).setToken(settings.token)
  try {
    await rest.put(Discord.Routes.applicationCommands(client.user.id), { body: commands })
  } catch (error) {
    console.error(error)
  }
})
