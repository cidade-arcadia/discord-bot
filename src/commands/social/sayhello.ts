import { Command } from "../../interfaces"

export const command: Command = {
  name: "sayhello",
  description: "Fala Olá.",
  isModCmd: true,
  aliases: ["sh", "hello"],

  run: async (client, message, args) => {
    message.reply(`Olá ${message.author.username}`)
  },
}
