const Discord = require('discord.js');
const sounds = require('../../constants/sounds');
const ytdl = require('ytdl-core');

const getSound = (name) => sounds.find((sound) => sound.name === name);

const sendHelp = (message) => {
	Object.defineProperty(Array.prototype, 'chunkify', {
		value : function(chunkSize) {
			var array = this;
			return [].concat.apply(
				[],
				array.map(function(elem, i) {
					return i % chunkSize
						? []
						: [
								array.slice(i, i + chunkSize)
							];
				})
			);
		}
	});

	const fields = sounds.map((sound) => {
		const { link, ...soundInfo } = sound;
		return { ...soundInfo, inline: true };
	});

	let helpMessages = [];

	fieldChunks = fields.chunkify(25);
	console.log(fieldChunks);
	fieldChunks.forEach((chunk) => {
		let helpEmbed = new Discord.MessageEmbed()
			.setColor('#884EA0')
			.setTitle('Bruh Counter Bot Soundboard')
			.setURL('https://bruh-counter.glitch.me/')
			.setDescription(
				"Use 'bruhsound' as the prefix for each of the commands listed below. Make sure you " +
					"are in a voice channel, and the bot will play the corresponding sound. For example: 'bruhsound simp'."
			)
			.setThumbnail('https://cdn.glitch.com/62eb5e7a-660b-4ac6-88e3-e3c7284d991e%2FDa_bois2.png?v=1589680294845');

		chunk.forEach((field) => {
			helpEmbed = helpEmbed.addField(field.name, field.value, field.inline);
		});
		helpMessages.push(helpEmbed);
	});

	helpMessages.forEach((helpEmbed) => message.channel.send(helpEmbed));
};

module.exports = {
	name    : 'bruhsound',
	args    : true,
	async execute(client, message, args) {
		if (!args.length) return;
		console.log(client.voice.connections);
		const name = args[0].toLowerCase();
		const sound = getSound(name);

		if (!sound && name !== 'help')
			message.reply(`"${name}" is not a valid sound. Here are all the available options:`);

		if (name === 'help' || !sound) sendHelp(message);
		else if (message.member.voice.channel) {
			let isPlaying = false;
			for (const v of client.voice.connections.array()) {
				if (v.channel.id === message.member.voice.channel.id) {
					isPlaying = true;
					break;
				}
			}
			if (isPlaying) {
				//IMPLEMENTATION WILL BE ADDED LATER
				//FOR NOW BRUHSOUND IS NOT AVAILABLE WHILE QUEUE IS NOT EMPTY
				message.reply(
					"Bruhsound is not currently available while the bruh music player is in use. Please use the 'bruhstop' command to continue using broundsounds. Note: this will delete all songs from the queue!"
				);
			} else {
				// IF BRUHPLAY IS CURRENTLY NOT BEING UTILIZED IN THE CURRENT CHANNEL
				const connection = await message.member.voice.channel.join();
				const dispatcher = connection.play(
					ytdl(sound.link, {
						filter : 'audioonly'
					})
				);
				dispatcher.on('finish', () => {
					message.member.voice.channel.leave();
					dispatcher.destroy();
				});
			}
		}
	}
};
