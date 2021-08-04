import { Config } from "../interfaces"
import { getAdminRole, getModRoles } from "./roleMapper"

export const globalConfig: Config = {
  token: process.env.DISCORD_BOT_API_KEY,
  prefix: process.env.DISCORD_BOT_PREFIX,
  adminRole: getAdminRole(),
  modRoles: getModRoles()
}
