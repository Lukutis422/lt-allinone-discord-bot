port { Client, GatewayIntentBits, Collection, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.spamMap = new Map();

// Load commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(`file://${filePath}`)).default;
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log(`✅ Botas prisijungė kaip ${client.user.tag}`);
});

// Welcome sistema
client.on("guildMemberAdd", member => {
  const channel = member.guild.systemChannel;
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("Sveikas atvykęs!")
    .setDescription(`Labas, ${member} 👋 Sveikas prisijungęs!`)
    .setColor(0x00ff99);

  channel.send({ embeds: [embed] });
});

// Anti-Spam sistema
client.on("messageCreate", message => {
  if (message.author.bot) return;

  const now = Date.now();
  const timestamps = client.spamMap.get(message.author.id) || [];
  const filtered = timestamps.filter(ts => now - ts < config.antiSpamInterval);

  filtered.push(now);
  client.spamMap.set(message.author.id, filtered);

  if (filtered.length > config.antiSpamLimit) {
    message.delete().catch(() => {});
    message.channel.send(`${message.author}, nustok spaminti!`);
  }
});

// Command handler
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("Įvyko klaida vykdant komandą.");
  }
});

client.login(process.env.DISCORD_TOKEN)