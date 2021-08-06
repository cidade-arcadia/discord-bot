export const getAdminRole = (): string => {
  const adminRole = process.env.DISCORD_BOT_ADMIN_ROLE
  return adminRole
}

export const getModRoles = (): string[] => {
  const modRoles = process.env.DISCORD_BOT_MOD_ROLES.trim().split(",")
  return modRoles.map((id) => id)
}
