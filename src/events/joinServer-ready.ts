import {TextChannel, ThreadChannel } from "discord.js"
import { Event } from "../interfaces"

export const event: Event = {
  name: "ready",
  run: async (client) => {
    //caching "recruit"
    const recruitChannel = (await client.channels.fetch(
      client.config.recruitChannelID,
    )) as TextChannel
    const recruitMessage = await recruitChannel.messages.fetch(client.config.recruitMessageID)

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
