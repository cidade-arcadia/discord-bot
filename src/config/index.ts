import { Config } from "../interfaces"
import { getAdminRole, getModRoles } from "./roleMapper"

export const globalConfig: Config = {
  token: process.env.DISCORD_BOT_API_KEY,
  prefix: process.env.DISCORD_BOT_PREFIX,
  adminRole: getAdminRole(),
  modRoles: getModRoles(),
  guildId: process.env.DISCORD_BOT_GUILD_ID,
  joinChannelId: process.env.DISCORD_BOT_JOIN_CHANNEL_ID,
  joinRoleId: process.env.DISCORD_BOT_JOIN_ROLE_ID,
  memberRoleId: process.env.DISCORD_BOT_MEMBER_ROLE_ID,
}
