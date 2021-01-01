const axios = require('axios');

const apiEnum = Object.freeze({
	GET_GUILDS         : Symbol('GET_GUILDS'),
	GET_GUILD          : Symbol('GET_GUILD'),
	POST_GUILD         : Symbol('POST_GUILD'),
	PUT_GUILD_NAME     : Symbol('PUT_GUILD_NAME'),
	PUT_GUILD_FLAGS    : Symbol('PUT_GUILD_FLAGS'),
	GET_SESSIONS       : Symbol('GET_SESSIONS'),
	GET_SESSION        : Symbol('GET_SESSION'),
	GET_GUILD_SESSIONS : Symbol('GET_GUILD_SESSIONS'),
	POST_SESSION       : Symbol('POST_SESSION'),
	PUT_SESSION_QUEUE  : Symbol('PUT_SESSION_QUEUE'),
	PUT_SESSION_END    : Symbol('PUT_SESSION_END')
});

class RequestBuilder {
	constructor() {
		this.endpoint = null;
		this.method = null;
		this.params = null;
		this.body = null;
	}
	setEndpoint(endpoint, method) {
		this.endpoint = endpoint;
		this.method = method;
		return this;
	}
	setParams(params) {
		let paramStr = '/';
		params.forEach((param) => {
			paramStr += `${param.key}=${param.value}&`;
		});
		paramStr = paramStr.slice(0, -1);
		this.params = paramStr;
		return this;
	}
	setBody(body) {
		this.body = body;
		return this;
	}
	build() {
		if (this.endpoint == undefined || this.method == undefined) {
			return null;
		}
		if (this.params == undefined) {
			this.params = '';
		}
		const url = 'http://localhost:3001' + this.endpoint + this.params;
		return new Request(url, this.method, this.body);
	}
}

class Request {
	constructor(url, method, body) {
		this.url = url;
		this.method = method;
		this.body = body;
	}
	async execute() {
		let results = await axios[this.method](this.url, this.body);
		return results.data;
	}
}

const apiHandler = (req) => {
	const { apiFn, data } = req;
	let requestBuilder = new RequestBuilder();
	switch (apiFn) {
		case apiEnum.GET_GUILDS:
			requestBuilder = requestBuilder.setEndpoint('/api/servers', 'get');
			break;
		case apiEnum.GET_GUILD:
			requestBuilder = requestBuilder.setEndpoint('/api/servers', 'get').setParams({ key: '', value: data.id });
			break;
		case apiEnum.POST_GUILD:
			requestBuilder = requestBuilder
				.setEndpoint('/api/servers', 'post')
				.setBody({ guildId: data.guildId, guildName: data.guildName });
			break;
		case apiEnum.PUT_GUILD_NAME:
			requestBuilder = requestBuilder.setEndpoint('/api/servers', 'put').setParams([
				{ key: 'id', value: data.id },
				{ key: 'newName', value: data.guildName }
			]);
			break;
		case apiEnum.PUT_GUILD_FLAGS:
			requestBuilder = requestBuilder.setEndpoint('/api/servers', 'put').setParams([
				{ key: 'flags', value: data.flags }
			]);
			break;
		case apiEnum.GET_SESSIONS:
			requestBuilder = requestBuilder.setEndpoint('/api/sessions', 'get');
			break;
		case apiEnum.GET_SESSION:
			requestBuilder = requestBuilder.setEndpoint('/api/sessions', 'get').setParams([
				{ key: 'id', value: data.id }
			]);
			break;
		case apiEnum.GET_GUILD_SESSIONS:
			requestBuilder = requestBuilder.setEndpoint('/api/sessions/server', 'get').setParams([
				{ key: 'id', value: data.id }
			]);
			break;
		case apiEnum.POST_SESSION:
			requestBuilder = requestBuilder.setEndpoint('/api/sessions', 'post').setBody({
				guildId   : data.id,
				channelId : data.channelId,
				queue     : data.queue,
				pastSongs : data.pastSongs,
				sync      : false
			});
			break;
		case apiEnum.PUT_SESSION_QUEUE:
			requestBuilder = requestBuilder
				.setEndpoint('/api/sessions', 'put')
				.setBody({ id: data.id, guildId: data.guildId, queue: data.queue, pastSongs: data.pastSongs });
			break;
		case apiEnum.PUT_SESSION_END:
			requestBuilder = requestBuilder.setEndpoint('/api/sessions', 'put').setParams([
				{ key: 'id', value: data.id },
				{ key: 'end', value: true }
			]);
			break;
		default:
			break;
	}
	return requestBuilder.build();
};

module.exports.apiHandler = apiHandler;
module.exports.apiEnum = apiEnum;
