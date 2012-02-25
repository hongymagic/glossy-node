/* vim: set noexpandtab autoindent smartindent tabstop=4 shiftwidth=4: */

'use strict';



var

	config = require('./config.js'),
	configure = require('./lib/configure.js'),
	express = require('express'),
	router;



// Start the server at configured port

router = module.exports = express.createServer();
router.listen(config.port, null);


// Configure Express application (router)

configure(__dirname, express, router);



// Any route that is not part of asset manager will load the main single page

router.get('*', function (req, res) {
	return res.render('layout.mustache.html');
});


// Run rabbit run!

console.log('Running in ' + (process.env.NODE_ENV || 'development') + ' mode @ ' + config.host + ':' + config.port);
