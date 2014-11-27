var mobile = require('./mobile');
var app = require('./app');
var controller = require('../controllers/server');

module.exports = function(app) {
	var io = require('socket.io')(app);

	io.on('connection', function (socket) {
		socket.on('mobile:register', function (data) {
			controller.addDevice(socket);
		});

		socket.on('mobile:ping', function(data) {
			controller.ping(socket, data);
		});

		socket.on('app:register', function (data) {
			controller.registerServer(socket);
			controller.sendDeviceList();
		});


		socket.on('app:getDeviceList', function (data) {
			controller.sendDeviceList();
		});

		socket.on('app:start', function (data) {
			controller.start(data);
		});

		socket.on('app:stop', function (data) {
			controller.stop(data);
		});

		socket.on('app:getResult', function(data) {
			controller.sendResult();
		});

		socket.on('disconnect', function(){
			controller.removeDevice(socket.id);
		});
	});
};
