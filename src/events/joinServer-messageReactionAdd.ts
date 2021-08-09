import { Event } from "../interfaces"
import { MessageCollector, MessageReaction, User } from "discord.js"

export const event: Event = {
  name: "messageReactionAdd",
  run: async (client, reaction: MessageReaction, user: User) => {
    const guild = await client.guilds.fetch(client.config.guildId)
    const channel = await client.channels.fetch(client.config.joinChannelId)
    // Extract the member object from the author (who created the message)
    const authorMember = await guild.members.fetch(reaction.message.author.id)
    // Extract the member object from the user (who reacted to the post)
    const userMember = await guild.members.fetch(user.id)
    // Checks if the message is valid and is not coming from a bot
    if (
      reaction.message.channel.id !== client.config.joinChannelId ||
      reaction.message.author.bot ||
      user.bot ||
      !userMember.roles.cache.hasAny(
        ...client.config.modRoles,
        client.config.adminRole,
      )
    )
      return

    const roleToRemove = await guild.roles.fetch(client.config.joinRoleId)
    const roleToAdd = await guild.roles.fetch(client.config.memberRoleId)
    const authorUser = await client.users.fetch(reaction.message.author.id)
    if (reaction.emoji.name === "✅") {
      authorMember.roles.add(roleToAdd)
      authorMember.roles.remove(roleToRemove)
      authorUser.send(
        `Você agora é reconhecido como parte dos ${roleToAdd.name} ! Seja bem-vindo`,
      )
      reaction.message.delete()
      console.log(
        `join: user "${authorMember.displayName}" accepted into "${roleToAdd.name}" with removal of "${roleToRemove.name}" by "${userMember.displayName}"`,
      )
    }
    if (reaction.emoji.name === "❌") {
      const dmChannel = await userMember.createDM()
      dmChannel.send(
        `Favor especificar o motivo da recusa da solicitação usuário <@${authorMember.id}>`,
      )
      const collector = dmChannel.createMessageCollector({
        filter: (m) => m.author.id === user.id,
        max: 1,
        time: 120000,
      })
      collector.on("collect", (msg) => {
        authorUser.send(
          `Sua solicitação para membro foi negada por <@${userMember.id}> - Com a seguinte justificativa:`,
        )
        authorUser.send(msg.content)
        reaction.message.delete()
      })
      collector.on("end", (collected) => {
        const userMessage = collected.first()
        dmChannel.send(
          `Você negou a entrada do usuário <@${authorMember.id}> com a justificativa:`,
        )
        dmChannel.send(userMessage.content)
        console.log(
          `join: user "${authorMember.displayName}" denied access by "${userMember.displayName}" with the reason: ${userMessage.content}`,
        )
      })
    }
  },
}
