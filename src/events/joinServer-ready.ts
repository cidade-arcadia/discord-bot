import { ThreadChannel } from "discord.js"
import { Event } from "../interfaces"

export const event: Event = {
  name: "ready",
  run: async (client) => {
    const channel = (await client.channels.fetch(
      client.config.joinChannelId,
    )) as ThreadChannel
    const messages = await channel.messages.fetch()
    messages.map(async (msg) => {
      const member = await channel.guild.members.fetch(msg.author.id)
      if (member.roles.cache.has(client.config.joinRoleId)) {
        msg.react("✅")
        msg.react("❌")
      }
    })
  },
}
