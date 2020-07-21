# Bruh Counter

### Bruh Counter is a Discord bot that counts bruhs and performs a variety of other features ranging from semi-useful to completely useless.

## Quick run down of the main features

### The Bruh Counter (what you are here for):

The bot will look for messages containing "bruh" anywhere in them (case in-sensitive). If no other person is tagged in the message,
the message sender will be logged as the bruh recorder and initiater. If you tag someone like "@person bruh", they will be recorded as 
the initiaterThere are a few escape phrases where bruh can be used without being logged. These include "bruh log", "bruh count", "bruhplay",
"bruhskip", "bruhsound", and "bruhmeme". Bruh count will trigger the bot to respond with the total number of bruh moments in the server. 
You can also tag someone like "@person bruh count" to find how many bruh moments they have initiated. Bruh log will respond with the spreadsheet URL.

### Bruhsound

Type "bruhsound help" for more info. You can add your own custom sounds in /constants/sounds.js.

### Bruhplay and Bruhskip

Your typical music bot. Right now it only works with YouTube links.

### Bruhrepeat

Repeats the current sound playing by adding it to next in the queue.

### Bruhpause and Bruhresume

Pauses and resumes the music.

### Bruhnext

Adds song to the beginning of the queue.

### Bruhqueue

Lists all the songs in the queue as well as the recently played songs.

### Bruhplaylist

Creates new playlists from the queue when used with the 'create' keyword. For example: <code>bruhlplaylist create My Playlist 1</code>. Playlists can be played back by using the command without the create keyword.

### Bruhvolume

Changes the volume of the bot.

### Bruhmeme

Use "bruhmeme add KEYWORD LINK" to add the meme image to the DB. Replace KEYWORD and LINK with your values.
Use "bruhmeme KEYWORD" and the bot will post the image from the link.

### Polls

Use "!poll blah blah whatever your question is?" and the bot will do it's magic. You might need to enter your own emoji IDs in /commands/prefix/polls.js.
I am using upvote and downvote emojis.

## How to install and use:

1. Clone this project and open the project in your IDE of choice
2. Create a Discord bot from the Discord Developer Portal. If you don't know how to do this, there are plenty of online resources.
    - Add your Discord token to your environment variables file. See the env\_template.txt file for more info.
3. Configure Google Sheets by creating a project on the Google Cloud Console. More info on how to use Google Sheets in Node.js can
    be found online.
    - For this bot, I am using a deprecated API which works, but you may want to look into swapping this out for the new
    Google API (or wait for me to do it which may or may not happen).
    - Make sure you fill in all the needed credentials for Google Sheets into you .env file. Again, see the env\_template.txt.
    - [Create a copy of this Spreadsheet](https://docs.google.com/spreadsheets/d/1MUZcKztlf3qGp23CcdMSAcIgS4h8Plg-AO14D7Q5g6M/edit?usp=sharing)
    - Enter the URL to your copy in the .env and replace the sheet ids you see in util/spreadsheet.js with your document's id.
4. Download the ffmpeg executable file from [here](https://ffmpeg.org/download.html) and put it in the project's root directory.
5. Figure out which features you want to use from the bot.
    - If your don't want to use the !movies command, you can delete it from /commands/prefix/movie.js. This command has a specific use case 
    for my personal server, but you can keep it if you'd like. Just make sure to configure the OMDB key in you env file. You will also need a
    separate Google Sheet for queuing movies.
    - Another command which you may not need is !setlights and its aliases !lifx and !annoycj. These commands are used to control my smart
    light bulbs. If you want to use this, make sure to enter your Lifx API token in the .env.
6. Configure your custom word counter (if you want to). This can be used to track a specific word or phrase other than "Bruh" that is said in voice channels.
    To use it, you type your customizable command in a text channel after the phrase is said in a voice channel.
    - First determine what you want to track. In fact, it doesn't even need to be a word! For example: someone gets tilted.
    - Set a CUSTOM\_DYNAMIC\_COUNTER\_WORD in your .env. For this example we can call it "tilted"
    - Next, set a CUSTOM\_DYNAMIC\_COUNTER\_WORD\_TRIGGER. This will trigger the bot to increment the log and respond. For this example we can call it "got"
    - Next, set the CUSTOM\_DYNAMIC\_COUNTER\_WORD\_RESPONSE. It is what the bot responds with when the command is called. For example, "bro chill out."
    - Lastly, set the CUSTOM\_DYNAMIC\_COUNTER\_WORD\_COUNT\_PHRASE. This is a minor customization which is used by the bot when getting the count.
    With the default bruh coutner, the bot will respond with "There are x recorded bruh moments." The CUSTOM\_DYNAMIC\_COUNTER\_WORD\_COUNT\_PHRASE in this case
    is "bruh moment", and the bot will automatically decide if it should be plural or not. In this example, we can set it to "tantrum".
    - Also, don't figure to add the link to the log. It is the second sheet in the document you copied earlier.
7. To host the bot locally, make sure you have nodejs and npm installed on your machine. Then from the project's root directory, use the following command: npm install
8. Run the following to start the bot: node server.js

## Uptime Robot

If you want to host your bot online using a free service like Glitch or Heroku, create an UptimeRobot account and add a HTTP monitor for your bot. This will keep it
up and running 24/7. Add the token to your .env.

