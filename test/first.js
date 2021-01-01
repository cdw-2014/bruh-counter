const sessionManager = require('./session');

module.exports = function first() {
	sessionManager.on('update', (servers) => {
		console.log('FROM 1: ', servers);
	});
	let server1 = { name: 'test1', test: true };
	console.log('1 before', sessionManager.pullServer(1));
	sessionManager.pushServer(1, server1);
	console.log('1 after', sessionManager.pullServer(1));
};
