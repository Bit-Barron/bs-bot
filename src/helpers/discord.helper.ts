import { ColorResolvable, EmbedBuilder } from "discord.js";

export const createEmbed = (
  title: string,
  description: string,
  color: ColorResolvable,
) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color);
};
