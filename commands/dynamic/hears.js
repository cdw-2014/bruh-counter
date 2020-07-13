const counter = require("./counter");
const china = require("./china");
const maze = require("./maze");
const rambling = require("./rambling");
const Discord = require("discord.js");
const CUSTOM_WORD = process.env.CUSTOM_DYNAMIC_COUNTER_WORD;

module.exports = {
  name: "hears",
  args: true,
  execute(client, message, args) {
    const content = message.content.toLowerCase();

    if (message.author.id === "346865197530742786") {
      rambling.execute(client, message, args);
    }

    if (content.includes("bruh") || content.includes(CUSTOM_WORD)) {
      counter.execute(client, message, args);
    } else if (content.includes("maze")) {
      maze.execute(client, message, args);
    } else if (content.includes("china")) {
      china.execute(client, message, args);
    }
  }
};
