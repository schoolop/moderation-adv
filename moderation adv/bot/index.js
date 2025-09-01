const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const config = require("../config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Commands
client.commands = new Map();
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(".")) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = client.commands.get(cmdName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (err) {
        console.error(err);
        message.reply("There was an error executing that command!");
    }
});

client.login(config.token);
