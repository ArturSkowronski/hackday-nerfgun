//soo lame

var devices = [];
var running = false;
var result = 0;
var name = 0;

var results = [];

var serverDevice;

exports.addDevice = function(socket) {
	devices[socket.id] = socket;
}

exports.registerServer = function(socket) {
	serverDevice = socket;
}

exports.sendDeviceList = function() {
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
	delete devices[id];
}
