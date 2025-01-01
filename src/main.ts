import { importx } from "@discordx/importer";

import { log } from "console";
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
  (interaction) => void bot.executeInteraction(interaction),
);

bot.on("messageCreate", (message) => void bot.executeCommand(message));

bot.on(
  "messageReactionAdd",
  (reaction, user) => void bot.executeReaction(reaction, user),
);

const main = async () => {
  await importx(`${__dirname}/{events,commands}/**/*.{ts,js}`);

  if (!token) {
    throw Error("Could not find TOKEN in your environment");
  }
  await bot.login(token);
};

main();
