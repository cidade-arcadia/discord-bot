import { Event } from "../interfaces"
import { MessageEmbed, MessageReaction, User, Role } from "discord.js"

export const event: Event = {
  name: "messageReactionAdd",
  run: async (client, reaction: MessageReaction, user: User) => {

    const guild = await client.guilds.fetch(client.config.guildId)
    // Extract the member object from the user (who reacted to the post)
    const userMember = await guild.members.fetch(user.id)
    // Checks if the message is valid and is not coming from a bot
    if (
      reaction.message.id !== client.config.recruitMessageID ||
      reaction.message.channel.id !== client.config.recruitChannelID ||
      user.bot ||
      !userMember.roles.cache.hasAny(
        ...client.config.modRoles,
        client.config.adminRole,
      )
    )
      return

    const pvpRole = await guild.roles.fetch(client.config.pvpRecruitID)
    const pveRole = await guild.roles.fetch(client.config.pveRecruitID)
    let role: Role
    let successMsg = new MessageEmbed()
        .setColor("#FFD100")
        .setTitle("Novo cargo adquirido!")       
        .setTimestamp()
        .setFooter(`${userMember.displayName}`, `${user.avatarURL()}`)
      
    //reacted to pvp role emoji
    if (reaction.emoji.name === "⚔️") {
      role = pvpRole as Role;
    }
    //reacted to pve role emoji
    if (reaction.emoji.name === "🏕️") {
      role = pveRole as Role;
    }

    successMsg.addFields(
      {
        name: `Parabéns, ${userMember.displayName}`,
        value: `Você recebeu o cargo de ${role.name}`,
      },
    )
    userMember.send({ embeds: [successMsg] })
    userMember.roles.add(role)

    console.log(
      `join: user "${userMember.displayName}" accepted into "${role.name}"`
    )
  }
}
