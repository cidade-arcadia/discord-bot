import { CommandInteraction, MessageCollector, TextChannel } from "discord.js"
import { Controller } from "../../interfaces"

export const controller: Controller = {
  name: "post",
  description: "Arcas transmite uma mensagem à um canal de sua escolha",
  isAdminCmd: true,
  options: [
    {
      name: "channel",
      description: "Escolha o canal que você deseja transmitir sua mensagem",
      type: "CHANNEL",
      required: true,
    },
  ],

  run: async (client, interaction: CommandInteraction, args) => {
    const [channelId] = args
    const channel: TextChannel = client.channels.cache.get(
      channelId,
    ) as TextChannel
    interaction.followUp({
      content: "Agora Envie a mensagem que deseja transmitir a este canal",
    })
    const collector = new MessageCollector(interaction.channel, {
      filter: (m) => m.author.id === interaction.user.id,
      max: 1,
    })
    collector.on("collect", (msg) => {
      channel.send(msg.content)
    })
    collector.on("end", (collected) => {
      const userMessage = collected.first()
      interaction.channel
        .send({
          content: `Sua palavra foi compartilhada com os Arcadianos do canal ${channel.name}`,
        })
        .then((msg) =>
          setTimeout(() => {
            msg.delete()
            userMessage.delete()
          }, 5000),
        )
    })
  },
}
