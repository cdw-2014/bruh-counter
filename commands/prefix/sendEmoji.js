const emojis = require('../../constants/emojis');

module.exports = {
	name        : '!emoji',
	description : 'Use GIF emojis and external emojis',
	args        : true,
	execute(client, message, args) {
		emojis.forEach((emoji) => {
			if (args[0] === emoji.name) {
				message.channel.send(emoji.code);
			}
		});
	}
};
