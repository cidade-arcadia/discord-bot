import { Command } from "../../interfaces"

export const command: Command = {
  name: "test",
  description: "Teste de comando.",
  isModCmd: true,
  aliases: ["t"],

  run: async (client, message, args) => {
    message.reply(`Test is successfull`)
  },
}
