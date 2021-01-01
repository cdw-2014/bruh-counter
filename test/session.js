const EventEmitter = require('events');

class SessionManager extends EventEmitter {
	constructor() {
		super();
		if (SessionManager.instance == null) {
			this.servers = {};
			SessionManager.instance = this;
		}
		SessionManager.instance.on('updateFromFront', (id, server) => (this.servers[id] = server));
		return SessionManager.instance;
	}

	pullServer(id) {
		if (this.servers[id]) {
			return this.servers[id];
		}
		return null;
	}

	pushServer(id, server) {
		this.servers[id] = server;
		// SessionManager.instance.emit('update', this.servers);
	}
}

const sessionManager = new SessionManager();
module.exports = sessionManager;
