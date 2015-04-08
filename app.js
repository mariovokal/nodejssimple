var express = require('express'),
	app = express(),
	http = require('http'),
	config = require('./config/' + process.env.NODE_ENV.toLowerCase() + '.js'),
	logger = require('./lib/logger.js').init(app, config),
	LA = require('./lib/localEvents.js')
;

logger.trace("Starting app in environment: " + process.env.NODE_ENV);

/**
 * Configure application.
 */
app.set('port', process.env.PORT || config.port);
app.disable("x-powered-by");
app.set("config", config);

/**
 * Create http server
 */
var server = http.createServer(app);
server.listen(app.get('port'));

/**
 * Run required libs
 */
var io = require('./lib/socketio.js').init(app, server, logger);

/**
 * Process controll functions
 */
process.on('uncaughtException', function(err) {
	logger.info("ERROR APP PROCESS ---uncaughtException---", err.stack);
});
