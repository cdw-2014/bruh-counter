const fs = require("fs");
const Discord = require("discord.js");
const MusicPlayer = require("./commands/music/MusicPlayer.js"); // Singleton handling music player/queue
let musicQueue = [];

const musicHandler = data => {
  let { command, client, message, args } = data;
  if (command === "bruhplay") MusicPlayer.play(client, message, args);
  else if (command === "bruhskip") MusicPlayer.skip(client, message, args);
  else if (command === "bruhstop") MusicPlayer.stop(client, message, args);
};

const handler = () => {
  const client = require("./bot.js");
  client.commands = new Discord.Collection();
  client.skills = new Discord.Collection();

  const prefixCommandFiles = fs
    .readdirSync("./commands/prefix")
    .filter(file => file.endsWith(".js"));

  for (const file of prefixCommandFiles) {
    const command = require(`./commands/prefix/${file}`);
    client.commands.set(command.name, command);
  }

  const hears = require("./commands/dynamic/hears");

  client.once("ready", () => {
    client.user.setStatus("online");
    const statusText = "The Steam Summer Sale Provides";
    client.user.setActivity(statusText, {
      type: "PLAYING",
      url: "https://bruh-counter.glitch.me/"
    });
    console.log("Ready!");
  });

  // client.on("debug", console.log);

  client.on("message", message => {
    if (message.author.bot) return;
    //660330099018825748 bot id
    //console.log(message.member.guild.voiceStates)
    // console.log(client.guilds.cache.get("110842175884918784"));

    const regex = /[^\s"]+|"([^"]*)"/gi;
    var args = [];

    do {
      var match = regex.exec(message.content);
      if (match != null) {
        args.push(match[1] ? match[1] : match[0]);
      }
    } while (match != null);
    // const args = message.content.toLowerCase().split(" ");
    const command = args.shift().toLowerCase();

    if (require("./constants/musicCommands").includes(command)) {
      musicHandler({ command, client, message, args });
    } else if (!client.commands.has(command)) {
      hears.execute(client, message, args);
    } else {
      try {
        client.commands.get(command).execute(client, message, args);
      } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
      }
    }
  });

  client.login(process.env.DISCORD_TOKEN).catch(console.error);
};

module.exports.handler = handler;
