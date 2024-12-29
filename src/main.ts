import { dirname, importx } from "@discordx/importer";

import { log } from "console";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { Client } from "discordx";

const token = process.env.DISCORD_BOT_TOKEN;

export const bot = new Client({
  intents: [],
  partials: [],
  silent: true,
  simpleCommand: {},
});

bot.once("ready", async () => {
  await bot.initApplicationCommands();
  log("Bot started");
});

bot.on(
  "interactionCreate",
  (interaction) => void bot.executeInteraction(interaction)
);

bot.on("messageCreate", (message) => void bot.executeCommand(message));

bot.on(
  "messageReactionAdd",
  (reaction, user) => void bot.executeReaction(reaction, user)
);

const main = async () => {
  await importx(`${__dirname}/{events,commands}/**/*.{ts,js}`);

  // Let's start the bot
  if (!token) {
    throw Error("Could not find TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(token);

  bot.user?.setPresence({
    activities: [{ name: ".gg/coding", type: ActivityType.Watching }],
  });
};

main();
