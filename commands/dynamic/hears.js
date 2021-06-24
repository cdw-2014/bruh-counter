const counter = require('./counter');
const china = require('./china');
const maze = require('./maze');
const rambling = require('./rambling');
const Discord = require('discord.js');
const CUSTOM_WORD = process.env.CUSTOM_DYNAMIC_COUNTER_WORD;

module.exports = {
	name    : 'hears',
	args    : true,
	execute(client, message, args) {
		const content = message.content.toLowerCase();
		const words = content.replace(/[^a-zA-Z0-9 ]/g, '').split(' ');

		if (message.author.id === '346865197530742786') {
			rambling.execute(client, message, args);
		}

		if (words.includes('bruh') || content.includes(CUSTOM_WORD)) {
			counter.execute(client, message, args);
		} else if (words.includes('maze')) {
			maze.execute(client, message, args);
		} else if (words.includes('china')) {
			china.execute(client, message, args);
		} else if (words.includes('bruhhhhhh')) {
			message.channel.send(
				'That’s 5 “h”s too much buddy and now you have two options presented before you. You can either correct your spelling and only have lost 1 downvote (mine that I just cast ;) or you can choose to leave your bastardized form of the English language on exhibition and get a few hundred downvotes. Since you only have 2k karma in 2 years on reddit I recommend you choose wisely 😉'
			);
		}
	}
};
