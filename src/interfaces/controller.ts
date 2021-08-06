import Client from "../client"
import { ApplicationCommandOptionData, Interaction } from "discord.js"

interface Run {
  (client: Client, interaction: Interaction, args: string[])
}

export interface Controller {
  name: string
  description?: string
  options?: ApplicationCommandOptionData[]
  isAdminCmd?: boolean
  isModCmd?: boolean
  run: Run
}
