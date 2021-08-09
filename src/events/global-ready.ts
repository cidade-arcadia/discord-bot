import { Event } from "../interfaces"

export const event: Event = {
  name: "ready",
  run: async (client) => {
    await client.guilds.cache
      .get(client.config.guildId)
      .commands.set(client.controllerList)
    console.log(`${client.user.tag} is running and watching!`)
  },
}
