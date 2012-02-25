var

	config = require('../config.js'),
	vows = require('vows'),
	assert = require('assert'),
	http = require('http'),
	suite = vows.describe('courses-api');


// Helpers for testing HTTP status codes

var api = {
	get: function (path) {
		return function () {
			http.get({
				host: config.host,
				port: config.port,
				path: path
			}, this.callback);
		};
	}
};

function assertStatusCode (code) {
	return function (res, e) {
		assert.equal(res.statusCode, code);
	};
}


suite
	.addBatch({
		'GET /courses': {
			'without params': {
				topic: api.get('/courses'),
				'should respond with a 200 OK': assertStatusCode(200)
			},
		}
	})
	.export(module);
