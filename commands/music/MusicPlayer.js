const Discord = require("discord.js");

let servers = {};
let isPlaying = false;

const displaySong = (connection, message) => {
  var server = servers[message.guild.id];

  const ytdl = require("ytdl-core");
  server.dispatcher = connection.play(
    ytdl(server.queue[0], {
      filter: "audioonly",
      quality: "highestaudio",
      volume: 0.6
    })
  );

  server.dispatcher.on("finish", async () => {
    let info = await ytdl.getInfo(server.queue.shift());
    const title = info.title;
    const finishedSong = title;
    message.channel.send(`${finishedSong} has finished playing`);
    if (server.queue[0]) displaySong(connection, message);
    else isPlaying = false;
  });
};

const MusicPlayer = {
  play: async (client, message, args) => {
    if (!args.length) return;

    if (!servers[message.guild.id])
      servers[message.guild.id] = {
        queue: [],
        dispatcher: null
      };

    let server = servers[message.guild.id];
    const link = args[0];

    server.queue.push(link);
    console.log("Server", server, "isPlaying", isPlaying);
    if (!message.guild.voiceConnection && !isPlaying) {
      message.member.voice.channel.join().then(connection => {
        isPlaying = true;
        displaySong(connection, message);
      });
    }
  },
  skip: (client, message, args) => {
    let server = servers[message.guild.id];
    if (!server.queue || !server.queue.length)
      message.reply(
        "There is no song playing to skip! use the following command to play a song or queue additional songs while one is playing: ```bruhplay <youtube link>```"
      );

    if (server.dispatcher) server.dispatcher.end();
  },
  stop: (client, message, args) => {
    let server = servers[message.guild.id];
    console.log(message.guild.voice);
    if (message.guild.voice) {
      message.guild.voiceConnection.disconnect();
    }
  },
  repeat: () => {}
};

Object.freeze(MusicPlayer);
module.exports = MusicPlayer;
