import { Event } from "../interfaces"
import { MessageEmbed, MessageReaction, User } from "discord.js"

export const event: Event = {
  name: "messageReactionAdd",
  run: async (client, reaction: MessageReaction, user: User) => {
    const guild = await client.guilds.fetch(client.config.guildId)
    const botMember = await guild.members.fetch("872270773002326087")
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
      const successMsg = new MessageEmbed()
        .setColor("#FFD100")
        .setTitle("Bem-Vindo!")
        .addFields(
          {
            name: `Parabéns, ${authorMember.displayName}`,
            value: `Com sua identidade registrada, você se tornou um cidadão de **Arcádia!**`,
          },
          {
            name: "**Antes de entrar, gostaria de te passar algumas dicas:**",
            value: `> **1ª** - Temos um código de leis dentro de nossa cidade, a fim de preservar a boa convivência e um ambiente agradável. Você poderá consultar nossas leis na sala ${guild.channels.cache
              .get("871050393927442432")
              .toString()}. Leia atentamente e evite problemas com os outros cidadãos! \n
            > **2ª** - Nossa cidade é bastante grande e, por conta disso, alguns arcadianos recém chegados podem ficar um pouco perdidos entre as ruas e vielas de nossos distritos. Para facilitar a orientação dentro da cidade, organizamos o ${guild.channels.cache
              .get("871834799919235113")
              .toString()} com todas as construções e distritos mais importantes. Recomendo dar uma olhadinha quando se sentir perdido. \n
            > **3º** - Infelizmente, vivemos num mundo assolado por guerras e conflitos. Com o objetivo de defender nossa cidade e nosso povo da ruína, criamos um exército para manter os inimigos distantes. Caso tenha interesse em ajudar nessa empreitada, aliste-se em nossas fileiras na sala ${guild.channels.cache
              .get("872364364076834858")
              .toString()}.`,
          },
        )
        .setTimestamp()
        .setFooter(`${userMember.displayName}`, `${user.avatarURL()}`)
      authorUser.send({ embeds: [successMsg] })
      reaction.message.delete()
      console.log(
        `join: user "${authorMember.displayName}" accepted into "${roleToAdd.name}" with removal of "${roleToRemove.name}" by "${userMember.displayName}"`,
      )
    }
    if (reaction.emoji.name === "❌") {
      const negateMsg = new MessageEmbed()
        .setColor("#FFD100")
        .setTitle("Ação Necessária!")
        .setThumbnail(`${botMember.user.avatarURL()}`)
        .addFields({
          name: `Olá ${userMember.displayName}`,
          value: `Qual o motivo da recusa de solicitação do forasteiro ${authorMember.user.toString()}? \n\n **LEMBRANDO:** A justificativa será enviada para ${authorMember.user.toString()}. Seja claro e objetivo.`,
        })
        .setTimestamp()
      const dmChannel = await userMember.createDM()
      dmChannel.send({ embeds: [negateMsg] })
      const collector = dmChannel.createMessageCollector({
        filter: (m) => m.author.id === user.id,
        max: 1,
        time: 120000,
      })
      collector.on("collect", (msg) => {
        const negateUserMsg = new MessageEmbed()
          .setColor("#FFD100")
          .setTitle("Solicitação Negada!")
          .addFields(
            {
              name: `Olá ${authorMember.displayName}.`,
              value: `Infelizmente, sua solicitação de acesso à nossa cidade foi negada. Nosso Poeta Social ${userMember.user.toString()} recusou sua solicitação com a seguinte justificativa:`,
            },
            { name: "\u200B", value: `${msg.content}` },
          )
          .setTimestamp()
          .setFooter(`${userMember.displayName}`, `${user.avatarURL()}`)
        authorUser.send({ embeds: [negateUserMsg] })
        reaction.message.delete()
      })
      collector.on("end", (collected) => {
        const userMessage = collected.first()

        const negateFeedback = new MessageEmbed()
          .setColor("#FFD100")
          .setTitle("Solicitação Negada!")
          .setThumbnail(`${botMember.user.avatarURL()}`)
          .addFields(
            {
              name: `Olá ${userMember.displayName}`,
              value: `Você negou a entrada do usuário ${authorMember.user.toString()} com a seguinte justificativa:`,
            },
            {
              name: "\u200B",
              value: `${userMessage.content}`,
            },
          )
          .setTimestamp()

        dmChannel.send({ embeds: [negateFeedback] })
        console.log(
          `join: user "${authorMember.displayName}" denied access by "${userMember.displayName}" with the reason: ${userMessage.content}`,
        )
      })
    }
  },
}
