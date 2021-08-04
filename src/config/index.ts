import { Config } from "../interfaces"

export const globalConfig: Config = {
  token: process.env.DISCORD_BOT_API_KEY,
  prefix: process.env.DISCORD_BOT_PREFIX,
}
