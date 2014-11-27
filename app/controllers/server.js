//soo lame

var devices = [];
var running = false;
var result = 0;
var name = 0;

var results = [];

var serverDevice;

exports.addDevice = function(socket) {
	console.log('mobile device added!');
	devices[socket.id] = socket;
}

exports.registerServer = function(socket) {
	console.log('server device added!');
	serverDevice = socket;
}

exports.sendDeviceList = function() {
	console.log('sending device list!');
	var ids = [];
	for (var k in devices){
		if (devices.hasOwnProperty(k)) {
			ids.push(k);
		}
	}

	serverDevice.emit('app:deviceList', {
		devices: ids
	});
}

exports.start = function(data) {
	console.log('start!');
	name = data.name;

	running = true;
	result = 0;

	//for each device, send type
	for (var k in devices){
		if (devices.hasOwnProperty(k)) {
			//TODO: different types
			devices[k].emit('mobile:type', {
				type: 0
			});
		}
	}
}

exports.ping = function(socket, data) {
	console.log('got ping!!');
	console.log(data.score);

	result += data.score;

	//send new type
	//TODO: different type
	devices[socket.id].emit('mobile:type', {
		type: 0
	});

	//send info to a server
	serverDevice.emit('app:ping', {
		id: socket.id
	});
}

exports.getResult = function() {
	return result;
}

exports.stop = function() {
	console.log('stop');

	running = false;
	results.push({
		name: name,
		result: result
	});


	//for each device, send stop
	for (var k in devices){
		if (devices.hasOwnProperty(k)) {
			//TODO: different types
			devices[k].emit('mobile:stop', {});
		}
	}

	//send results to a server
	serverDevice.emit('app:result', {
		result: results
	})
}

exports.removeDevice = function(id) {
	console.log('remove device');
	delete devices[id];
}
