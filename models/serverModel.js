var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var serverSchema = new Schema({
	guildId   : { type: String, required: true, unique: true },
	guildName : { type: String, required: true },
	flags     : { type: Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Server', serverSchema);
