const router = require('express').Router();
const Session = require('../models/sessionModel');
const musicPlayer = require('../commands/music/MusicPlayer');

// GET all music sessions
router.get('/', (req, res) => {
	Session.find().then((sessions) => {
		res.json(servers);
	});
});

// GET a specific session by _id
router.get('/:id', (req, res) => {
	let { id } = req.params;
	Session.find({ _id: id }).then((session) => {
		res.json(session);
	});
});

// GET all sessions given a guildId
router.get('/server/:guildId', (req, res) => {
	let { guildId } = req.params;
	Session.find({ guildId: guildId }).then((sessions) => {
		res.json(sessions);
	});
});

// POST new music session
router.post('/', (req, res) => {
	let { guildId, channelId, messageId, queue, pastSongs } = req.body;
	console.log('POSTING');
	Session.create({
		guildId,
		channelId,
		messageId,
		queue,
		pastSongs
	}).then((session) => {
		res.json(session);
		console.log('qqqqqqqqqqqqqqqqqqq', session);
	});
});

// PUT queue and pastSongs when songs or queued/finish playing
router.put('/', (req, res) => {
	const id = req.body.id;
	const guildId = req.body.guildId;
	const queue = req.body.queue;
	const pastSongs = req.body.pastSongs;
	console.log('testtt', id, guildId);
	Session.updateOne(
		{ _id: id },
		{
			$set : {
				queue     : queue,
				pastSongs : pastSongs
			}
		}
	)
		.then(async () => {
			await Session.findOne({ _id: id })
				.sort({ _id: -1 })
				.limit(1)
				.then((updatedSession) => musicPlayer.setServer(guildId, updatedSession));
		})
		.catch((err) => console.error(err));
});

// PUT isCurrent to false whn dispatcher is destroyed
router.put('/id=:id&end=true', (req, res) => {
	const id = req.params.id;
	Session.updateOne(
		{ guildId: id, isCurrent: true },
		{
			$set : {
				isCurrent : false
			}
		}
	).catch((err) => console.error(err));
});

module.exports = router;
