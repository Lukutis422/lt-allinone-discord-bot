import { EmbedBuilder } from "discord.js";
import config from "../config.js";

export async function sendModLog(guild, description) {
  const channel = guild.channels.cache.find(
    c => c.name === config.modLogChannelName
  );

  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("🛡 Moderacijos veiksmas")
    .setDescription(description)
    .setColor(0xff0000)
    .setTimestamp();

  channel.send({ embeds: [embed] });
}