//soo lame

var devices = [];
var running = false;
var result = 0;
var name = 0;

var results = [];

var serverDevice;

var interval = null;

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
	if(val < 0.25 ) {
		console.log('1');
		return 1;
	}
	if(val < 0.80) {
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

currentIndex = 0;

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

	interval = setInterval(exports.change, 5000);
	currentIndex = 0;
}


exports.change = function() {
	var index = 0;
	var done = false;
	for (var k in devices){
		if (devices.hasOwnProperty(k)) {
			if(currentIndex == index){
				devices[k].emit('mobile:type', {
					type: exports.random()
				});
				done = true;
				break;
			}
			index++;
		}
	}
	if(!done) {
		currentIndex = 0;
	}
}

exports.ping = function(socket, data) {
	if(serverDevice !== undefined && running) {
		console.log('got ping!!');
		console.log(data.score);

		result += data.score;

		//send new type
		console.log('sending another one');
		console.log(socket.id);
		devices[socket.id].emit('mobile:type', {
			type: exports.random()
		});

		//send info to a server
		serverDevice.emit('app:ping', {
			id: socket.id,
			result: result
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

	clearInterval(interval);
}

exports.removeDevice = function(id) {
	console.log('remove device');
	delete devices[id];
}
