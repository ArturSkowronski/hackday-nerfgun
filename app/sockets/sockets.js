module.exports = function(app) {
	app.io.route('hello', function(req) {
		console.log('got hello!');
		req.io.broadcast('hello visitor');
	});
};
