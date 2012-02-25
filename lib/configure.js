/* vim: set noexpandtab autoindent smartindent tabstop=4 shiftwidth=4: */

var

	config = require('../config.js'),
	connect = require('connect'),
	assetManager = require('connect-assetmanager'),
	assetHandler = require('connect-assetmanager-handlers'),
	Mustache = require('mustache'),
	template;


// Returns an API that plugs into Express's view rendering engine, the
// templating engine used here is: Mustache.js

template = {
	compile: function (source, options) {
		if (typeof source != 'string') {
			return source;
		}

		return function (options) {
			options.locals = options.locals || {};
			options.partials = options.partials || {};

			if (options.body) {
				locals = options.body;
			}

			return Mustache.to_html(source, options.locals, options.partials);
		};
	},
	render: function (template, options) {
		template = this.compile(template, options);
		return template(options);
	}
};


module.exports = function (dirname, express, app) {

	// Define a way to handle static assets such as JavaScript/Stylesheets using
	// connect-assetmanager

	var assets = assetManager({
		'js': {
			'route': /\/assets\/js\/all.js/,
			'path': dirname + '/public/js/',
			'dataType': 'javascript',
			'files': [
				'mustache.js',
				'underscore.js',
				'jquery.js',
				'backbone.js',
				'main-app.js'
			],
			'debug': config.debug
		},
		'css': {
			'route': /\/assets\/css\/all.css/,
			'path': dirname + '/public/css/',
			'dataType': 'css',
			'files': [
				'bootstrap.css',
				'bootstrap-responsive.css',
				'styles.css'
			],
			'debug': config.debug,
			'preManipulate': {
				'^': [
					assetHandler.yuiCssOptimize,
					assetHandler.fixVendorPrefixes
				]
			}
		}
	});



	app.configure(function () {
		app.set('view engine', 'mustache');
		app.set('view options', { layout: false });
		app.set('views', dirname + '/views');

		app.register('.html', template);

		app.use(express.bodyParser());
		app.use(express.cookieParser());

		app.use(assets);
	});

	app.configure('development', function () {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		app.use(express.static(dirname + '/public', { maxAge: 0 /* day */ }));
		app.use(express.static(dirname + '/assets', { maxAge: 0 /* day */ }));
	});

	app.configure('string', 'production', function () {
		app.use(express.errorHandler());
		app.use(express.static(dirname + '/public', { maxAge: 60 * 60 * 24 /* day */ }));
		app.use(express.static(dirname + '/assets', { maxAge: 60 * 60 * 24 /* day */ }));
	});

	app.use(app.router);
};
