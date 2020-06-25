const spreadsheet = require("../../util/spreadsheet.js");
const CUSTOM_WORD_RESPONSE = process.env.CUSTOM_DYNAMIC_COUNTER_WORD_COUNT_PHRASE;

module.exports = {
  name: "getCount",
  args: true,
  execute(client, message, countType) {
    const SPREADSHEET_ID = countType === "bruh" ? 0 : 1; // DECIDES WHICH SPREADSHEET TO USE
    const RESPONSE_STRING = countType === "bruh" ? "bruh moment" : CUSTOM_WORD_RESPONSE;
    const recipient = message.mentions.users
      .filter(user => user.bot === false)
      .last();

    if (message.mentions.users.size === 1) {
      let count = spreadsheet.getRowCount(recipient.tag, SPREADSHEET_ID);
      count.then(x => {
        let msg = `There ${
          x === 1 ? "is" : "are"
        } ${x} recorded ${RESPONSE_STRING}${
          x === 1 ? "" : "s"
        } caused by ${recipient}.`;
        message.channel.send(msg);
      });
    } else {
      let count = spreadsheet.getRowCount(null, SPREADSHEET_ID);
      count.then(x => {
        let msg = `There ${
          x === 1 ? "is" : "are"
        } ${x} total recorded ${RESPONSE_STRING}${x === 1 ? "" : "s"}.`;
        message.channel.send(msg);
      });
    }
  }
};
