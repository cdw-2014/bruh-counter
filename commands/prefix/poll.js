const Discord = require("discord.js");

const sendPoll = (message, args) => {
  let pollEmbed = new Discord.MessageEmbed()
    .setColor("#884EA0")
    .setTitle(args.join(" "))
    .setThumbnail(
      "https://cdn.glitch.com/62eb5e7a-660b-4ac6-88e3-e3c7284d991e%2F51cOM2ZPaoL.png?v=1592777453065"
    )
    // .setDescription(
    //   `Vote with the emojis. Use !endpoll <id> to end the poll. "Copy ID" in message settings.`
    // )
    .addField("Created By", message.author);
  message.channel
    .send(pollEmbed)
    .then(poll => {
      poll.react("694374024540848139");
      poll.react("694374224302964763");
      // poll.pin();
      message.delete();
    })
    .catch(err => console.log(err));
};

module.exports = {
  name: "!poll",
  args: true,
  execute(client, message, args) {
    if (!args.length) return;

    sendPoll(message, args);
  }
};
