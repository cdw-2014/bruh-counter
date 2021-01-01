const router = require('express').Router();
const Server = require('../models/serverModel');

// GET all Discord guilds that the bot has joined
router.get('/', (req, res) => {
	console.log('REQ RECEIVED!');
	Server.find().then((servers) => {
		res.json(servers);
	});
});

// GET a specific Discord guild by server ID
router.get('/:id', (req, res) => {
	let { id } = req.params;
	Server.find({ guildId: id }).then((server) => {
		res.json(server);
	});
});

// POST new guild when bot joins
router.post('/', (req, res) => {
	let { guildId, guildName } = req.body;
	Server.create({
		guildId,
		guildName,
		flags     : {}
	});
});

// PUT new guild name when name is changed
router.put('/id=:id&newName=:newName', (req, res) => {
	const guildId = req.params.id;
	const newName = req.params.newName;
	Server.updateOne(
		{ guildId: guildId },
		{
			$set : {
				guildName : newName
			}
		}
	).catch((err) => console.error(err));
});

// PUT new flags when guild settings are updated
// TODO: Parse flags object since req body is not
//       available for put requests for some stupid reason
router.put('/id=:id&flags=:flags', (req, res) => {
	const guildId = req.params.id;
	const flags = req.params.flags;
	Server.updateOne(
		{ guildId: guildId },
		{
			$set : {
				guildName : newName
			}
		}
	).catch((err) => console.error(err));
});

module.exports = router;
