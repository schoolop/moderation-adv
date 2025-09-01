const express = require("express");
const bodyParser = require("body-parser");
const Warning = require("../models/Warning");

const apiApp = express();
apiApp.use(bodyParser.json());

// WARN
apiApp.post("/api/warn", async (req, res) => {
  const { targetId, reason, modId } = req.body;
  const guild = client.guilds.cache.get("YOUR_GUILD_ID");
  const member = await guild.members.fetch(targetId).catch(()=>null);
  if(member) await member.send(`You have been warned: ${reason}`);
  await Warning.create({ userId: targetId, guildId: guild.id, moderatorId: modId, reason });
  res.send({ success: true });
});

// TIMEOUT
apiApp.post("/api/timeout", async (req, res) => {
  const { targetId, duration, modId } = req.body;
  const guild = client.guilds.cache.get("YOUR_GUILD_ID");
  const member = await guild.members.fetch(targetId).catch(()=>null);
  if(member) await member.timeout(duration * 60 * 1000, "Timed out by mod");
  res.send({ success: true });
});

// KICK
apiApp.post("/api/kick", async (req, res) => {
  const { targetId } = req.body;
  const guild = client.guilds.cache.get("YOUR_GUILD_ID");
  const member = await guild.members.fetch(targetId).catch(()=>null);
  if(member) await member.kick("Kicked by mod");
  res.send({ success: true });
});

// BAN
apiApp.post("/api/ban", async (req, res) => {
  const { targetId } = req.body;
  const guild = client.guilds.cache.get("YOUR_GUILD_ID");
  const member = await guild.members.fetch(targetId).catch(()=>null);
  if(member) await member.ban({ reason: "Banned by mod" });
  res.send({ success: true });
});

apiApp.listen(3001, () => console.log("Bot API running on port 3001"));
