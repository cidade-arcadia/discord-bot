import { Command } from "../../interfaces"

export const command: Command = {
  name: "test",
  aliases: ["t", "testing"],
  run: async (client, message, args) => {
    message.reply(`Test is successfull`)
  },
}
