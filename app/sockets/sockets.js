module.exports = function(app) {
	var io = require('socket.io')(app);

	io.on('connection', function (socket) {
		socket.broadcast.emit('new visitor', {hello: 'world'});

		socket.on('ready', function (data) {
			console.log('got ready shiat!');
			socket.emit('talk', {message: 'world'});
		});
	});
};
