module.exports = {
    name: "rambling",
    args: true,
    execute(client, message, args) {
      if (args.length >= 10) {
          message.channel.send("What.");
      }
    }
  };
  