const getCount = require("./getCount");
const getSpreadsheet = require("./getSpreadsheet");
const incrementCount = require("./incrementCount");
const CUSTOM_WORD = process.env.CUSTOM_DYNAMIC_COUNTER_WORD;
const CUSTOM_WORD_TRIGGER = process.env.CUSTOM_DYNAMIC_COUNTER_WORD_TRIGGER;


module.exports = {
  name: "counter",
  args: true,
  execute(client, message, args) {
    const content = message.content.toLowerCase()
    let countType = "";
    let eventType = "";

    if (message.mentions.users.size > 1) return;

    // DETERMINE COUNT TYPE
    if (content.includes("bruh")) countType = "bruh";
    else if (content.includes("n word")) countType = CUSTOM_WORD;
    else return;

    // DETERMINE EVENT TYPE
    if (content.includes(`${countType} count`)) eventType = "getCount";
    else if (content.includes(`${countType} log`))
      eventType = "getSpreadsheet";
    else if (
      countType === CUSTOM_WORD &&
      content.includes(`${CUSTOM_WORD_TRIGGER} ${CUSTOM_WORD}`)
    )
      eventType = "incrementCount";
    else if (countType === "bruh" && !content.includes("bruhsound"))
      eventType = "incrementCount";
    else return;

    // EXECUTE EVENT
    switch (eventType) {
      case "getCount":
        getCount.execute(client, message, countType);
        return;
      case "getSpreadsheet":
        getSpreadsheet.execute(client, message, countType);
        return;
      case "incrementCount":
        incrementCount.execute(client, message, countType);
        return;
      default:
        return;
    }
  }
};
