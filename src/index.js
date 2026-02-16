import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Botas prisijungė kaip ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    return message.reply("🏓 Pong!");
  }

  if (message.content === "!serverinfo") {
    const embed = new EmbedBuilder()
      .setTitle("Serverio informacija")
      .addFields(
        { name: "Pavadinimas", value: message.guild.name, inline: true },
        { name: "Nariai", value: `${message.guild.memberCount}`, inline: true }
      )
      .setColor(0x5865F2);

    return message.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);