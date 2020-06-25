const Discord = require("discord.js");
const spreadsheet = require("../../util/spreadsheet.js");

module.exports = {
  name: "bruhmeme",
  args: true,
  async execute(client, message, args) {
    if (!args.length) return;
    if (args[0] === "add") {
      // POST A NEW MEME TO THE SPREADSHEET DATABASE
      let name,
        link,
        description,
        isDelete = false;
      if (!args.length >= 3) return;
      name = args[1];
      link = args[2];
      if (args.length >= 4) {
        if (args[3] === "-d") isDelete = true;
        else description = args[3];
      }
      if (args.length >= 5 && args[4] === "-d") {
        isDelete = true;
      }
      const existingMeme = await spreadsheet.getMeme(name);
      if (existingMeme != undefined) {
        message.reply(
          `There is already a meme with the name "${name}". Please use a different name or wait until I add an override feature.`
        );
      } else {
        spreadsheet.postMeme({ name, link, description });
        if (isDelete) {
          message.delete();
        }
      }
    } else {
      // GET EXISTING MEME TO POST TO DISCORD
      const name = args[0].toLowerCase();
      const meme = await spreadsheet.getMeme(name);

      if (meme == undefined) {
        message.reply(
          `No meme found with the name "${name}". Please use the following command to add it: \n\`\`\` bruhmeme add ${name} <INSERT LINK HERE> "INSERT OPTIONAL DESCRIPTION HERE IN QUOTES" [-d flag to delete your command message after adding meme to database]\`\`\``
        );
      } else {
        message.channel.send(meme.link);
        if (args[1] === "-d") {
          message.delete();
        }
      }
    }
  }
};
