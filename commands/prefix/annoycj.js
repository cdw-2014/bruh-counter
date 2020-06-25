module.exports = {
  name: "!annoycj",
  description: "Points to setlights command.",
  args: true,
  execute(client, message, args) {
    client.commands.get("setlights").execute(client, message, args);
  }
};
