const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const spreadsheet = require('../../util/spreadsheet.js');
const DELIMITER = require('../../constants/delimiter');

let servers = {};
let isPlaying = false;
let isDisconnecting = false;

const isUrl = (input) => {
	return input.includes('youtube.com');
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
		if (server.queue[0]) {
			dispatchSong(connection, message, args); // recursively dispatches next song in queue if there is more songs
		} else isPlaying = false; // otherwise sets isPlaying flag to false.
		if (isDisconnecting) {
			server.pastSongs = [];
			isDisconnecting = false;
		}
	});
};

const MusicPlayer = {
	play     : async (client, message, args) => {
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
	skip     : (client, message, args) => {
		let server = servers[message.guild.id];
		if (!server || !server.queue || !server.queue.length)
			message.reply(
				'There is no song playing to skip! use the following command to play a song or queue additional songs while one is playing: ```bruhplay <youtube link>```'
			);

		if (server && server.dispatcher) server.dispatcher.end();
	},
	stop     : async (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length > 1) {
				servers[message.guild.id].queue = [
					servers[message.guild.id].queue[0]
				];
			}
			isDisconnecting = true;
			await servers[message.guild.id].dispatcher.end();
			message.member.voice.channel.leave();
			servers[message.guild.id].pastSongs = [];
			servers[message.guild.id].dispatcher = null;
		}
	},
	repeat   : async (client, message, args) => {
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
	pause    : (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				servers[message.guild.id].dispatcher.pause();
			}
		}
	},
	resume   : (client, message, args) => {
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				servers[message.guild.id].dispatcher.resume();
			}
		}
	},
	next     : async (client, message, args) => {
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
	queue    : async (client, message, args) => {
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
	},
	playlist : async (client, message, args) => {
		const subcommand = args[0];
		let name = args.slice(1).join(' ');
		const link = ''; // TO-DO: CREATE SPOTIFY PLAYLIST AND POPULATE LINK
		let server = servers[message.guild.id];
		if (server && (subcommand === 'create' || subcommand === 'add')) {
			if (server.queue || server.pastSongs) {
				const songs = server.pastSongs.concat(server.queue).join(DELIMITER);
				const existingPlaylist = await spreadsheet.getPlaylist(name);
				if (existingPlaylist != null || name === 'create' || name === 'add') {
					message.reply(
						`There is already a playlist with the name "${name}". Please use a different name or wait until I add an override feature.`
					);
				} else {
					spreadsheet.postPlaylist({ name, link, songs });
					message.reply(`successfully created playlist called "${name}"!`);
				}
			}
		} else {
			//ADD PLAYLIST TO QUEUE
			name = args.join(' ');
			const playlist = await spreadsheet.getPlaylist(name);
			if (playlist == undefined) {
				message.reply(
					`No playlist found with the name "${name}". Please use the following command to add it: \n\`\`\` bruhplaylist create ${name}\`\`\``
				);
			} else {
				const playListToArray = playlist.songs.split(DELIMITER);

				if (!server) {
					servers[message.guild.id] = {
						queue      : [],
						pastSongs  : [],
						dispatcher : null
					};
					server = servers[message.guild.id];
				}
				server.queue.push(...playListToArray);
				message.channel.send(
					`\`\`\`Adding ${playListToArray.length} song${playListToArray.length > 1
						? 's'
						: ''} to the queue from playlist titled "${name}"\`\`\``
				);
				if (server.dispatcher !== null) {
					//IF THERE ALREADY A LISTENING SESSION IN PROGRESS
				} else {
					message.member.voice.channel.join().then((connection) => {
						isPlaying = true;
						dispatchSong(connection, message, args);
					});
				}
			}
		}
	},
	volume   : (client, message, args) => {
		const volume = args[0];
		if (servers[message.guild.id]) {
			if (servers[message.guild.id].queue.length) {
				const volumeValue = parseFloat(volume);
				if (volumeValue >= 0 && volumeValue <= 1 && volume != volumeValue + '%') {
					servers[message.guild.id].dispatcher.setVolume(volumeValue);
				} else if (volumeValue >= 0 && volumeValue <= 100 && volume == volumeValue + '%') {
					servers[message.guild.id].dispatcher.setVolume(volumeValue / 100.0);
				} else {
					message.reply(
						`sorry, I could not parse your volume input. Please use a percentage between 0 and 100% or a floating point number between 0 and 1.`
					);
				}
			}
		}
	}
};

Object.freeze(MusicPlayer);
module.exports = MusicPlayer;
