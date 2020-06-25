const Discord = require("discord.js");
const spreadsheet = require("../../util/spreadsheet.js");
const fetch = require("node-fetch");

const getMovieInfo = async (title, year) => {
  const url = `https://www.omdbapi.com/?t=${title.replace(/\s/, "+")}${
    year != null ? `&y=${year}` : ""
  }&apikey=${process.env.OMBD_KEY}`;
  return await fetch(url, { method: "GET" }).then(response => response.json());
};

const parseYear = title => {
  let newTitle = title,
    year = "";
  if (title.includes("(")) {
    year = title.match(/\(\d{4}\)/)[0];
    year = year.replace(/[()]/g, "");
    newTitle = title.substring(0, title.indexOf("(")).trim();
    return { newTitle, year };
  }
  return { newTitle, year: null };
};

const sendNextMovie = async (message, title, person) => {
  const { newTitle, year } = parseYear(title);
  if (year != null) title = newTitle;

  const data = await getMovieInfo(title, year);

  //console.log(data);

  let queueEmbed = new Discord.MessageEmbed()
    .setColor("#E51937")
    .setTitle("Movie Queue")
    .setURL(
      "https://docs.google.com/spreadsheets/d/1sMAlmWe6qIvSc21grnhqBrrOqv1NdFqyQ7YmMILKgtU/edit#gid=1387463060"
    )
    .setDescription(
      `The next movie in the queue is ${title} recommended by ${person}.`
    )
    .addFields(
      { name: "Length", value: data.Runtime || "Unknown" },
      { name: "Released", value: data.Released || "Unknown" },
      { name: "Genre", value: data.Genre || "Unknown" },
      { name: "IMBD Rating", value: data.imdbRating || "Unknown" },
      { name: "Director", value: data.Director || "Unknown" },
      { name: "Plot", value: data.Plot || "Unknown" }
    )
    .setThumbnail(data.Poster);
  message.channel.send(queueEmbed);
};

module.exports = {
  name: "!movie",
  args: true,
  async execute(client, message, args) {
    // if (!args.length) return;

    const movie = await spreadsheet.getMovie();
    // console.log(movie);
    const { movietitle, recommender } = movie;
    sendNextMovie(message, movietitle, recommender);
  }
};
