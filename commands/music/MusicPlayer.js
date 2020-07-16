const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

let servers = {};
let isPlaying = false;

const isUrl = (input) => {
  return input.includes("youtube.com");
  // let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\s+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  // return regexp.test(s);
}

const dispatchSong = (connection, message, args) => {
  var server = servers[message.guild.id];

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
    message.channel.send(`\`\`\`${finishedSong} has finished playing!\`\`\``);
    if (server.queue[0]) dispatchSong(connection, message, args);
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

    let link = "";

    if (isUrl(args[0])) {
      link = args[0]
    } else {
      let results = await yts(args.join(" "));
      if (results.videos && results.videos.length > 0) {
        link = results.videos[0].url;
      }
    }

    const title = (await ytdl.getInfo(link)).title

    if (server.queue.length) {
      message.channel.send(`\`\`\`${title} is #${server.queue.length} in the queue!\`\`\``)
    }

    server.queue.push(link);

    if (!message.guild.voiceConnection && !isPlaying) {
      message.member.voice.channel.join().then(connection => {
        isPlaying = true;
        dispatchSong(connection, message, args);
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
  stop: async (client, message, args) => {
    if (servers[message.guild.id]) {
      // message.member.voice.channel.leave();
      if (servers[message.guild.id].queue.length > 1) {
        servers[message.guild.id].queue = [servers[message.guild.id].queue[0]]
      }
      await servers[message.guild.id].dispatcher.end();
      // delete servers[message.guild.id]
      message.member.voice.channel.leave();
    }
  },
  repeat: async (client, message, args) => {
    if (servers[message.guild.id]) {
      if (servers[message.guild.id].queue.length) {
        const title = (await ytdl.getInfo(servers[message.guild.id].queue[0])).title
        message.channel.send(`\`\`\`${title} has been inserted into the queue! It will play again after this!\`\`\``)
        servers[message.guild.id].queue.splice(1, 0, servers[message.guild.id].queue[0])
      }
    }
  },
  pause: (client, message, args) => {
    if (servers[message.guild.id]) {
      if (servers[message.guild.id].queue.length) {
        servers[message.guild.id].dispatcher.pause();
      }
    }
  },
  resume: (client, message, args) => {
    if (servers[message.guild.id]) {
      if (servers[message.guild.id].queue.length) {
        servers[message.guild.id].dispatcher.resume();
      }
    }
  },
  next: async (client, message, args) => {
    if (servers[message.guild.id]) {
      if (servers[message.guild.id].queue.length) {
        let link = "";
        if (isUrl(args[0])) {
          link = args[0]
        } else {
          let results = await yts(args.join(" "));
          if (results.videos && results.videos.length > 0) {
            link = results.videos[0].url;
          }
        }
        const title = (await ytdl.getInfo(link)).title
        message.channel.send(`\`\`\`${title} has been inserted into the queue! It will play after this!\`\`\``)
        servers[message.guild.id].queue.splice(1, 0, link)
      }
    }
  }
};

Object.freeze(MusicPlayer);
module.exports = MusicPlayer;
