module.exports = {
  name: "!botstatus",
  args: true,
  execute(client, message, args) {
    if (!args.length) return;

    const status = args.join(" ");
    client.user.setActivity(status, {
      type: "PLAYING"
    });
  }
};
