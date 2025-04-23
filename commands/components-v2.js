const Discord = require("discord.js")
const { JsonDatabase } = require("anonymousdb")
const db = new JsonDatabase({ path: "./utils/database.json" })
const settings = require("../utils/settings.json")
const rest = new Discord.REST({ version: "10" }).setToken(settings.token)

module.exports = {
  slash: true,
  data: new Discord.SlashCommandBuilder()    
    .setName("components-v2")
    .setDescription("Components v12 example command.")
    .setDMPermission(false),
  
  async execute(client, interaction) { 
  
    await interaction.deferReply()
    
    const message = {
      flags: 1 << 15,
      components: [
        {
          "type": 17,
          "accent_color": 5793266,
          "spoiler": false,
          "components": [
            {
              "type": 9,
              "accessory": {
                "type": 2,
                "style": 1,
                "label": "Edit",
                "emoji": null,
                "disabled": false,
                "custom_id": "edit-button"
              },
              "components": [
                {
                  "type": 10,
                  "content": "- **Press button and edit message.**"
                }
              ]
            },
            {
              "type": 14,
              "divider": true,
              "spacing": 2
            },
            {
              "type": 1,
              "components": [
                {
                  "type": 2,
                  "style": 1,
                  "label": "Button 1",
                  "emoji": null,
                  "disabled": false,
                  "custom_id": "button-1"
                },
                {
                  "type": 2,
                  "style": 2,
                  "label": "Button 2",
                  "emoji": null,
                  "disabled": false,
                  "custom_id": "button-2"
                },
                {
                  "type": 2,
                  "style": 3,
                  "label": "Button 3",
                  "emoji": null,
                  "disabled": false,
                  "custom_id": "button-3"
                },
                {
                  "type": 2,
                  "style": 4,
                  "label": "Button 4",
                  "emoji": null,
                  "disabled": false,
                  "custom_id": "button-4"
                },
                {
                  "type": 2,
                  "style": 5,
                  "label": "Button 6",
                  "emoji": null,
                  "disabled": false,
                  "url": "https://discord.com/users/873182701061021696"
                }
              ]
            },
            {
              "type": 14,
              "divider": true,
              "spacing": 2
            },
            {
              "type": 1,
              "components": [
                {
                  "type": 3,
                  "custom_id": "select-menu",
                  "options": [
                    {
                      "label": "Option 1",
                      "value": "option-1",
                      "description": "Option 1 description.",
                      "emoji": null,
                      "default": false
                    },
                    {
                      "label": "Option 2",
                      "value": "option-2",
                      "description": "Option 2 description.",
                      "emoji": null,
                      "default": false
                    }
                  ],
                  "placeholder": "Select option and show reply message.",
                  "min_values": 1,
                  "max_values": 1,
                  "disabled": false
                }
              ]
            }
          ]
        } 
      ]
    }
    
    await rest.post(`/channels/${interaction.channelId}/messages`, { body: message })

    client.on("interactionCreate", async i => {
      if(!i.isButton() && !i.isStringSelectMenu()) return
      if(i.customId === "edit-button") {
        await i.deferUpdate()
    
        const newMessage = {
          flags: 1 << 15,
          components: [
            {
              "type": 17,
              "accent_color": 5793266,
              "spoiler": false,
              "components": [
                {
                  "type": 9,
                  "accessory": {
                    "type": 11,
                    "media": {
                      "url": client.user.displayAvatarURL()
                    },
                    "description": "Thumbnail",
                    "spoiler": false
                  },
                  "components": [
                    {
                      "type": 10,
                      "content": "- **Message edited.**"
                    }
                  ]
                },
                {
                  "type": 14,
                  "divider": true,
                  "spacing": 2
                },
                {
                  "type": 12,
                  "items": [
                    {
                      "media": {
                        "url": client.user.displayAvatarURL()
                      },
                      "description": "Image",
                      "spoiler": false
                    }
                  ]
                }
              ]
            } 
          ]
        }
    
        await rest.patch(`/channels/${i.channelId}/messages/${i.message.id}`, { body: newMessage })
                                                                        
      } else if(i.customId === "select-menu") {
        await i.deferUpdate()
        const value = i.values[0]
        
        await rest.post(`/channels/${interaction.channelId}/messages`, { 
          body: { 
            "content": `- **Message replyed, selected option: ${value}.**`,
            "message_reference": {
              "message_id": i.message.id
            }
          }
        })
        
      }
    })
    
  }
}
