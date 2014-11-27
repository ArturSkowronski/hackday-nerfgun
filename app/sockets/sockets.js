module.exports = function(app) {
	app.io.route('hello', function(req) {
		req.io.broadcast('hello visitor');
	})
};
