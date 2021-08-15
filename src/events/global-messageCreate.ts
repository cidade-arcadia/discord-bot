import { Event, Command } from "../interfaces"
import { Message } from "discord.js"

export const event: Event = {
  name: "messageCreate",
  run: (client, message: Message) => {
    // Checks if the message is valid and is not coming from a bot
    if (message.author.bot || !message.content.startsWith(client.config.prefix))
      return
    const args = message.content
      .slice(client.config.prefix.length) 
      .trim()
      .split(/ +/g)
    const cmd = args.shift().toLowerCase()
    /* Bouncer */
    if (!cmd) return
    const member = message.guild.members.cache.get(message.author.id)
    const command = client.commands.get(cmd) || client.aliases.get(cmd)
    if (command?.isAdminCmd && !member.roles.cache.has(client.config.adminRole))
      return
    if (
      command?.isModCmd &&
      !member.roles.cache.hasAny(...client.config.modRoles)
    )
      return
    /**/
    if (command) (command as Command).run(client, message, args)
  },
}
