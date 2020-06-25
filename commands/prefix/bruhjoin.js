module.exports = {
  name: "!botjoin",
  args: true,
  async execute(client, message, args) {
    const connection = await message.member.voice.channel.join();
  }
};
