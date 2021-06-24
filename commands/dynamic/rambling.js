module.exports = {
	name    : 'rambling',
	args    : true,
	execute(client, message, args) {
		if (args.length >= 60) {
			message.channel.send('What.');
		}
	}
};
