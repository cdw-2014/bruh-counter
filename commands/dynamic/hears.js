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
    const words = content.replace(/[^a-zA-Z0-9 ]/g, "").split(" ")

    if (message.author.id === "346865197530742786") {
      rambling.execute(client, message, args);
    }

    if (words.includes("bruh") || content.includes(CUSTOM_WORD)) {
      counter.execute(client, message, args);
    } else if (words.includes("maze")) {
      maze.execute(client, message, args);
    } else if (words.includes("china")) {
      china.execute(client, message, args);
    }
  }
};
