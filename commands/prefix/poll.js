const Discord = require("discord.js");
const reactionSets = require("../../constants/reactionSets");

const sendPoll = (message, question, emojis=[], options=[]) => {
  let pollEmbed = new Discord.MessageEmbed()
    .setColor("#884EA0")
    .setTitle(question)
    .setThumbnail(
      "https://cdn.glitch.com/62eb5e7a-660b-4ac6-88e3-e3c7284d991e%2F51cOM2ZPaoL.png?v=1592777453065"
    )
    .setDescription(
      `Created by ${message.author}`
    )
  options.map((option, i) => {
    pollEmbed = pollEmbed.addField(`Option ${i+1}`, option);
  });
  message.channel
    .send(pollEmbed)
    .then(poll => {
      emojis.forEach(emoji => poll.react(emoji))
      // poll.react("694374024540848139");
      // poll.react("694374224302964763");
      // poll.pin();
      message.delete();
    })
    .catch(err => console.log(err));
};

const getEmojis = (name) => {
  const set = reactionSets.filter(set => set.name == name);
  return set[0].emojis;
}

module.exports = {
  name: "!poll",
  args: true,
  execute(client, message, args) {
    if (!args.length) return;

    const pollType = args[0]
    let reactionSetName = "yesNo"
    let options = []
    let question = ""

    if (pollType.startsWith("-")) {
      question = args[1]
    } else {
      question = args.join(" ")
    }

    switch (pollType) {
      case "-2":
        reactionSetName = "twoOptions";
        if (args.length === 4) {
          options.push(args[2].replace("\"", ""))
          options.push(args[3].replace("\"", ""))
        }
        break;
      case "-3":
        reactionSetName = "threeOptions";
        if (args.length === 5) {
          options.push(args[2].replace("\"", ""))
          options.push(args[3].replace("\"", ""))
          options.push(args[4].replace("\"", ""))
       }
        break;
      case "-4":
        reactionSetName = "fourOptions";
        if (args.length === 6) {
          options.push(args[2].replace("\"", ""))
          options.push(args[3].replace("\"", ""))
          options.push(args[4].replace("\"", ""))
          options.push(args[5].replace("\"", ""))
        }
        break;
      default:
        reactionSetName = "fourOptions";
    }

    const emojis = getEmojis(reactionSetName)
    sendPoll(message, question, emojis, options);

  }
};
