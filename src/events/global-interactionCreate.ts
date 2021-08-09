import { Event, Command } from "../interfaces"
import { GuildMemberRoleManager, Interaction } from "discord.js"

export const event: Event = {
  name: "interactionCreate",
  run: async (client, interaction: Interaction) => {
    if (interaction.isCommand()) {
      await interaction
        .defer({
          ephemeral: true,
        })
        .catch(() => {})

      const cmd = client.controllers.get(interaction.commandName)
      // Check if the interaction is not a valid command, and then return
      if (!cmd)
        return interaction.followUp({ content: "Oops, ocorreu um erro!" })
      const member = interaction.guild.members.cache.get(interaction.user.id)
      // Check if the member has admin permission to use this interaction then return
      if (cmd.isAdminCmd && !member.roles.cache.has(client.config.adminRole))
        return interaction.followUp({
          content:
            "Este comando precisa de permissão de administrador para ser utilizado!",
        })
      // Check if the member has moderator permission to use this interactin then return
      if (cmd.isModCmd && !member.roles.cache.hasAny(...client.config.modRoles))
        return interaction.followUp({
          content:
            "Este comando precisa de permissão especial para ser utilizado!",
        })
      // If all checks pass, execute the command passing the args
      const args = []
      interaction.options.data.map((option) => {
        args.push(option.value)
      })
      cmd.run(client, interaction, args)
    }
  },
}
