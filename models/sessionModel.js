var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sessionSchema = new Schema({
	guildId    : { type: String, required: true },
	channelId  : { type: String, required: true },
	messageId  : { type: String, required: false },
	queue      : { type: Schema.Types.Mixed, required: true },
	pastSongs  : { type: Schema.Types.Mixed, required: true },
	dispatcher : { type: Schema.Types.Mixed, required: false },
	isCurrent  : { type: Boolean, default: true }
});

module.exports = mongoose.model('Session', sessionSchema);
