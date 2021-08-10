// Load Environment
import dotenv from "dotenv"
dotenv.config()

// Initialize Client

import Client from "./client"
new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
  ],
}).start()
