export const getAdminRole = (): number => {
  const adminRole = process.env.DISCORD_BOT_ADMIN_ROLE
  return +adminRole
}

export const getModRoles = (): number[] => {
  const modRoles = process.env.DISCORD_BOT_MOD_ROLES.trim().split(",")
  return modRoles.map((id) => +id)
}
