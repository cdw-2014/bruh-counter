const CUSTOM_WORD = process.env.CUSTOM_DYNAMIC_COUNTER_WORD;
const BRUH_SHEET = process.env.BRUH_COUNTER_SPREADSHEET;
const CUSTOM_SHEET = process.env.CUSTOM_DYNAMIC_COUNTER_SPREADSHEET;

module.exports = {
  name: "getSpreadsheet",
  args: true,
  execute(client, message, countType) {

    switch (countType) {
      case "bruh":
        message.channel.send(
          BRUH_SHEET
        );
        return;
      case CUSTOM_WORD:
        message.channel.send(
          CUSTOM_SHEET
        );
        return;
      default:
        return;
    }
  }
};
