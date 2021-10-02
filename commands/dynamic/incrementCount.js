const spreadsheet = require('../../util/spreadsheet.js');
const CUSTOM_WORD_RESPONSE = process.env.CUSTOM_DYNAMIC_COUNTER_WORD_RESPONSE;

module.exports = {
	name    : 'incrementCount',
	args    : true,
	execute(client, message, countType) {
		const SPREADSHEET_ID = countType === 'bruh' ? 0 : 1; // DECIDES WHICH SPREADSHEET TO USE

		let recipient = message.mentions.users.filter((user) => user.bot === false).last();

		if (message.mentions.users.size === 1) {
			// DETERMINE RESPONSE
			let msg = '';
			if (countType === 'bruh') {
				msg = `${recipient} BRUH`;
			} else {
				msg = `${recipient}, ${CUSTOM_WORD_RESPONSE}`;
			}

			message.channel.send(msg);

			spreadsheet.addRow(message.author.tag, recipient.tag, SPREADSHEET_ID);
		} else {
			message.channel.send('BRUH');
			spreadsheet.addRow(message.author.tag, message.author.tag, SPREADSHEET_ID);
		}
	}
};
