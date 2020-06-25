module.exports = {
  name: "!botname",
  args: true,
  execute(client, message, args) {
    if (!args.length) return;
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.reply("You need to be admin to do that.");
      return;
    }

    let upperArgs = message.content.split(" ");
    upperArgs.shift();
    const name = upperArgs.join(" ");
    client.user.setUsername(name);
  }
};
