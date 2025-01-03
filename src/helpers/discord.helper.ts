import { ColorResolvable, EmbedBuilder } from "discord.js";
import { s } from "@sapphire/shapeshift";

export const createEmbed = (
  title: string,
  description: string,
  color: string,
) => {
  const schema = s.object({
    title: s.string().lengthGreaterThanOrEqual(1),
    description: s.string().lengthGreaterThanOrEqual(1),
    color: s.literal("Green").or(s.literal("Red")).or(s.literal("Blue")),
  });

  const result = schema.parse({ title, description, color });

  return new EmbedBuilder()
    .setTitle(result.title)
    .setDescription(result.description)
    .setColor(result.color as ColorResolvable);
};
