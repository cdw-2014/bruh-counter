const http = require("http");
const express = require("express");
var monitor = require("uptime-robot");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.get("/commands", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/commands.html"));
});

app.get("/bruhsounds", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/bruhsounds.html"));
});

app.get("/secret", (req, res) => {
  res.send(require('./constants/script.js'));
});

const commandHandler = require("./commandHandler");
commandHandler.handler();

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

