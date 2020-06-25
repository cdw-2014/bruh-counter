require("dotenv").config();
const fetch = require("node-fetch");

const colors = require("../../constants/colors");

module.exports = {
  name: "!setlights",
  args: true,
  execute(client, message, args) {
    let rand = Math.floor(Math.random() * Math.floor(colors.length));
    let state = "color=" + colors[rand];
    let pulse = "period=1&cycles=8&color=" + colors[rand];
    let opt = Math.floor(Math.random() * Math.floor(5));

    for (const color in colors) {
      if (message.content.toLowerCase().includes(colors[color])) {
        opt = 1;
        state = "color=" + colors[color];
        if (message.content.includes("%")) {
          let words = message.content.split(" ");
          words.forEach(word => {
            if (word.includes("%")) {
              word = word.substring(0, word.length - 1);
              word = (parseInt(word) / 100.0).toString();
              let brightnessState = "brightness=" + parseFloat(word);
              fetch("https://api.lifx.com/v1/lights/all/state", {
                body: brightnessState,
                headers: {
                  Authorization: `Bearer ${process.env.LIFX_TOKEN}`,
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT"
              });
            }
          });
        }
      }
    }

    if (opt <= 2) {
      fetch("https://api.lifx.com/v1/lights/all/state", {
        body: state,
        headers: {
          Authorization: `Bearer ${process.env.LIFX_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT"
      })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    } else if (opt === 3) {
      fetch("https://api.lifx.com/v1/lights/all/effects/pulse", {
        body: pulse,
        headers: {
          Authorization: `Bearer ${process.env.LIFX_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    } else if (opt === 4) {
      fetch("https://api.lifx.com/v1/scenes", {
        headers: {
          Authorization: `Bearer ${process.env.LIFX_TOKEN}`
        }
      })
        .then(response => response.json())
        .then(data => {
          let scene = data[Math.floor(Math.random() * Math.floor(data.length))];
          let uuid = scene.uuid;
          let sceneurl =
            "https://api.lifx.com/v1/scenes/scene_id:" + uuid + "/activate";
          fetch(sceneurl, {
            headers: {
              Authorization: `Bearer ${process.env.LIFX_TOKEN}`
            },
            method: "PUT"
          });
        });
    }
  }
};
