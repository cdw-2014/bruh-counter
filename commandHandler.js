const fs = require('fs');
const Discord = require('discord.js');
const MusicPlayer = require('./commands/music/MusicPlayer.js'); // Singleton handling music player/queue

const musicHandler = (data) => {
	let { command, client, message, args } = data;
	if (command === 'bruhplay') MusicPlayer.play(client, message, args);
	else if (command === 'bruhskip') MusicPlayer.skip(client, message, args);
	else if (command === 'bruhstop') MusicPlayer.stop(client, message, args);
	else if (command === 'bruhrepeat') MusicPlayer.repeat(client, message, args);
	else if (command === 'bruhpause') MusicPlayer.pause(client, message, args);
	else if (command === 'bruhresume') MusicPlayer.resume(client, message, args);
	else if (command === 'bruhnext') MusicPlayer.next(client, message, args);
	else if (command === 'bruhqueue') MusicPlayer.queue(client, message, args);
};

const handler = () => {
	const client = require('./bot.js');
	client.commands = new Discord.Collection();
	client.skills = new Discord.Collection();

	const prefixCommandFiles = fs.readdirSync('./commands/prefix').filter((file) => file.endsWith('.js'));

	for (const file of prefixCommandFiles) {
		const command = require(`./commands/prefix/${file}`);
		client.commands.set(command.name, command);
	}

	const hears = require('./commands/dynamic/hears');

	client.once('ready', () => {
		client.user.setStatus('online');
		const statusText = 'The Steam Summer Sale Provides';
		client.user.setActivity(statusText, {
			type : 'PLAYING',
			url  : 'https://github.com/cdw-2014/bruh-counter'
		});
		console.log('Ready!');
	});

	//client.on("debug", console.log);

	client.on('message', (message) => {
		if (message.author.bot) return;

		const regex = /[^\s"]+|"([^"]*)"/gi;
		var args = [];

		do {
			var match = regex.exec(message.content);
			if (match != null) {
				args.push(match[1] ? match[1] : match[0]);
			}
		} while (match != null);

		let command;
		if (args.length) {
			command = args.shift().toLowerCase();
		}

		if (command && require('./constants/musicCommands').includes(command)) {
			musicHandler({ command, client, message, args });
		} else if (command && !client.commands.has(command)) {
			hears.execute(client, message, args);
		} else if (command) {
			try {
				client.commands.get(command).execute(client, message, args);
			} catch (error) {
				console.error(error);
				message.reply('there was an error trying to execute that command!');
			}
		}
	});

	client.login(process.env.DISCORD_TOKEN).catch(console.error);
};

module.exports.handler = handler;
