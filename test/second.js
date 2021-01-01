const sessionManager = require('./session');

module.exports = function second() {
	sessionManager.on('update', (servers) => {
		console.log('FROM 2: ', servers);
	});
	let server2 = { name: 'test2', test: false };
	console.log('2 before', sessionManager.pullServer(1));
	sessionManager.pushServer(2, server2);
	console.log('2 after', sessionManager.pullServer(2));
	server2.name = 'test222';
	sessionManager.pushServer(2, server2);
	console.log('2 last', sessionManager.pullServer(2));
};
