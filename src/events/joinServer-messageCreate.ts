import { Event } from "../interfaces"
import { Message } from "discord.js"

export const event: Event = {
  name: "messageCreate",
  run: async (client, message: Message) => {
    const guild = await client.guilds.fetch(client.config.guildId)
    const channel = await client.channels.fetch(client.config.joinChannelId)
    const member = await guild.members.fetch(message.author.id)
    // Checks if the message is valid and is not coming from a bot
    if (
      message.channel.id !== channel.id ||
      message.author.bot ||
      !message.guild ||
      !member.roles.cache.has(client.config.joinRoleId)
    )
      return
    message.react("✅")
    message.react("❌")
  },
}
