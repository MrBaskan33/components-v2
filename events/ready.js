const Discord = require("discord.js")

module.exports = {
  name: "ready",
  async execute(client) {
    
    const statusNames = ["mrbaskan", "components-v2"]
    let i = 0
    setInterval(() => {
      const name = statusNames[i]
      client.user.setPresence({
        activities: [{
          name,
          type: Discord.ActivityType.Custom
        }],
        status: "idle"
      })
      i = (i + 1) % statusNames.length
    }, 10000)
  
    console.log(`[${client.user.tag}] active.`) 
  }
}
