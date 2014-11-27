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
	exports.sendDeviceList();
}

exports.registerServer = function(socket) {
	console.log('server device added!');
	serverDevice = socket;
}

exports.random = function() {
	var val = Math.random();
	if(val < 0.33 ) {
		console.log('1');
		return 1;
	}
	if(val < 0.66) {
		console.log('2');
		return 2;
	}
	console.log('3');
	return 3;
}

exports.sendDeviceList = function() {
	if(serverDevice !== undefined) {
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
}

exports.start = function(data) {
	console.log('start!');
	name = data.name;

	running = true;
	result = 0;

	//for each device, send type
	for (var k in devices){
		if (devices.hasOwnProperty(k)) {
			console.log('sending type');
			devices[k].emit('mobile:type', {
				type: exports.random()
			});
		}
	}
}

exports.ping = function(socket, data) {
	if(serverDevice !== undefined) {
		console.log('got ping!!');
		console.log(data.score);

		result += data.score;

		//send new type
		//TODO: different type
		devices[socket.id].emit('mobile:type', {
			type: Math.random()
		});

		//send info to a server
		serverDevice.emit('app:ping', {
			id: socket.id,
			result: exports.random()
		});
	}
}

exports.sendResult = function() {
	//send results to a server
	serverDevice.emit('app:result', {
		result: results
	})
}

exports.stop = function() {

	if(serverDevice !== undefined) {
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

		console.log('sending results to serverDevice:', serverDevice);

		//send results to a server
		serverDevice.emit('app:result', {
			result: results
		})
	}

}

exports.removeDevice = function(id) {
	console.log('remove device');
	delete devices[id];
}
