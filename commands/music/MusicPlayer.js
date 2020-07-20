const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

let servers = {};
let isPlaying = false;

const isUrl = (input) => {
	return input.includes('youtube.com');
	// let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\s+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	// return regexp.test(s);
};

const dispatchSong = (connection, message, args) => {
	var server = servers[message.guild.id];

	server.dispatcher = connection.play(
		ytdl(server.queue[0], {
			filter  : 'audioonly',
			quality : 'highestaudio',
			volume  : 0.6
		})
	);

	server.dispatcher.on('finish', async () => {
		const finishedSong = server.queue.shift(); // finishedSong = URL of song that has finished playing. It is removed from the queue.
		server.pastSongs.push(finishedSong); // finishedSong is added to pastSongs
		const finishedSongTitle = (await ytdl.getInfo(finishedSong)).videoDetails.title; // finishedSongTitle = Title of finishedSong on YT
		message.channel.send(`\`\`\`${finishedSongTitle} has finished playing!\`\`\``); // sends message in Discord channel
		if (server.queue[0])
			dispatchSong(connection, message, args); // recursively dispatches next song in queue if there is more songs
		else isPlaying = false; // otherwise sets isPlaying flag to false.
	});
};

const MusicPlayer = {
	play   : async (client, message, args) => {
		if (!args.length) return;

		if (!servers[message.guild.id])
			servers[message.guild.id] = {
				queue      : [],
				pastSongs  : [],
				dispatcher : null
			};

		let server = servers[message.guild.id];

		let link = '';

		if (isUrl(args[0])) {
			link = args[0];
		} else {
			let results = await yts(args.join(' '));
			if (results.videos && results.videos.length > 0) {
				link = results.videos[0].url;
			}
		}

		const title = (await ytdl.getInfo(link)).videoDetails.title;

		if (server.queue.length) {
			message.channel.send(`\`\`\`${title} is #${server.queue.length} in the queue!\`\`\``);
		}

		server.queue.push(link);

		if (!message.guild.voiceConnection && !isPlaying) {
			message.member.voice.channel.join().then((connection) => {
				isPlaying = true;
				dispatchSong(connection, message, args);
			});
		}
	},
	skip   : (client, message, args) => {
		let server = servers[message.guild.id];
		if (!server || !server.queue || !server.queue.length)
			message.reply(
				'There is no song playing to skip! use the following command to play a song or queue additional songs while one is playing: ```bruhplay <youtube link>```'
			);

		if (server && server.dispatcher) server.dispatcher.end();
	},
	stop   : async (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length > 1) {
				servers[message.guild.id].queue = [
					servers[message.guild.id].queue[0]
				];
			}
			await servers[message.guild.id].dispatcher.end();
			servers[message.guild.id].pastSongs = [];
			message.member.voice.channel.leave();
		}
	},
	repeat : async (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				const title = (await ytdl.getInfo(servers[message.guild.id].queue[0])).videoDetails.title;
				message.channel.send(
					`\`\`\`${title} has been inserted into the queue! It will play again after this!\`\`\``
				);
				servers[message.guild.id].queue.splice(1, 0, servers[message.guild.id].queue[0]);
			}
		}
	},
	pause  : (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				servers[message.guild.id].dispatcher.pause();
			}
		}
	},
	resume : (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				servers[message.guild.id].dispatcher.resume();
			}
		}
	},
	next   : async (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				let link = '';
				if (isUrl(args[0])) {
					link = args[0];
				} else {
					let results = await yts(args.join(' '));
					if (results.videos && results.videos.length > 0) {
						link = results.videos[0].url;
					}
				}
				const title = (await ytdl.getInfo(link)).videoDetails.title;
				message.channel.send(`\`\`\`${title} has been inserted into the queue! It will play after this!\`\`\``);
				servers[message.guild.id].queue.splice(1, 0, link);
			}
		}
	},
	queue  : async (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length || servers[message.guild.id].pastSongs.length) {
				let queueMsg = `\`\`\`\n`;

				if (servers[message.guild.id].pastSongs.length) {
					queueMsg += 'Recently Played:\n';

					for (const song of servers[message.guild.id].pastSongs) {
						const songInfo = await ytdl.getInfo(song);
						queueMsg += songInfo.videoDetails.title + '\n';
					}
					queueMsg += '----------\n';
				}

				if (servers[message.guild.id].queue.length) {
					queueMsg += `Currently Playing: ${(await ytdl.getInfo(servers[message.guild.id].queue[0]))
						.videoDetails.title}\n`;
					queueMsg += '----------\n';
				}

				if (servers[message.guild.id].queue.length > 1) {
					queueMsg += 'Queued:\n';

					for (const song of servers[message.guild.id].queue.slice(1)) {
						const songInfo = await ytdl.getInfo(song);
						queueMsg += songInfo.videoDetails.title + '\n';
					}
				}
				queueMsg += `\`\`\``;
				message.channel.send(queueMsg);
			}
		}
	}
};

Object.freeze(MusicPlayer);
module.exports = MusicPlayer;
