var winston = require('winston'),
	LA = require('../lib/localEvents.js'),
	app,
	config,
	logger;

exports.init = function (application, configuration) {
	app = application;
	config = configuration;

	if (logger) {
		return logger;
	}

	var custom = {
		colors: {
			trace: "white",
			debug: "blue",
			info: "green",
			warn: "yellow",
			error: "red"
		},
		levels: {
			trace: 0,
			debug: 1,
			info: 2,
			warn: 3,
			error: 4
		},
	};

	logger = new(winston.Logger)({
		exitOnError: false,
		levels: custom.levels,
		colors: custom.colors,
		transports: [
			new(winston.transports.Console)({
				level: "trace",
				colorize: true,
				timestamp: true,
				handleExceptions: true
			})
		]


	});

	LA.emit("system:logger:loaded");
	return logger;
};