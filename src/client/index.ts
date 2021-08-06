import { Client, Collection } from "discord.js"
import path from "path"
import { readdirSync } from "fs"
import { Command, Event, Config, Controller } from "../interfaces"
import { globalConfig } from "../config"

class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection()
  public controllers: Collection<string, Controller> = new Collection()
  public aliases: Collection<string, Command> = new Collection()
  public events: Collection<string, Event> = new Collection()
  public config: Config = globalConfig
  public controllerList: any[] = []

  public async start() {
    // Login to the BOT using the token credentials
    this.login(this.config.token)

    /* Commands */
    const commandPath = path.join(__dirname, "..", "commands")
    readdirSync(commandPath).forEach((dir) => {
      const commands = readdirSync(`${commandPath}/${dir}`).filter((file) =>
        file.endsWith(".ts"),
      )
      for (const file of commands) {
        const { command } = require(`${commandPath}/${dir}/${file}`)
        this.commands.set(command.name, command)
        if (command?.aliases.length !== 0) {
          command.aliases.forEach((alias) => this.aliases.set(alias, command))
        }
      }
    })

    /* Commands */
    const controllerPath = path.join(__dirname, "..", "controllers")
    readdirSync(controllerPath).forEach((dir) => {
      const controllers = readdirSync(`${controllerPath}/${dir}`).filter(
        (file) => file.endsWith(".ts"),
      )
      for (const file of controllers) {
        const { controller } = require(`${controllerPath}/${dir}/${file}`)
        this.controllers.set(controller.name, controller)
        this.controllerList.push(controller)
      }
    })

    /* Events */
    const eventPath = path.join(__dirname, "..", "events")
    readdirSync(eventPath).forEach(async (file) => {
      const { event } = await import(`${eventPath}/${file}`)
      this.events.set(event.name, event)
      this.on(event.name, event.run.bind(null, this))
    })
  }
}

export default BotClient
