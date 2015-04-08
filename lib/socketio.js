var socketIO = require('socket.io'),
	LA = require('../lib/localEvents.js'),
	log = require('../lib/logger.js'),
	app,
	server,
	logger,
	io;

exports.init = function (application, serverInstance) {
	if (io) {
		return io;
	}

	app = application;
	server = serverInstance;
	logger = log.init(app, app.get("config"));

	io = socketIO.listen(server);
	io.sockets.on('connection', socketIOHandler);
	logger.trace("socketIO is running...");
	LA.emit("system:io:loaded");

	return io;
};

var socketIOHandler = function (socket) {

	socket.on('subscribe', function (data) {
		if (!data.channel) {
			logger.error("socketIO subscribe with invalid data", data);
			return false;
		}

		var channel = data.channel;

		logger.info("socketIO subscribe", data);
		socket.join( channel );
	});

	socket.on('unsubscribe', function (data) {
		if (!data || !data.channel) {
			logger.error("socketIO unsubscribe with invalid data", data);
			return false;
		}

		var channel = data.channel;

		logger.info("socketIO unsubscribe", data);
		socket.leave( channel );
	});

	socket.on('disconnect', function (data) {
		logger.warn("socketIO disconnect " + socket.id + " - transport used: " + socket.client.conn.transport.constructor.name, data);
	});

	socket.on('emit', function (data) {
		if (!data || !data.channel || !data.message) {
			logger.error("socketIO emit with invalid data", data);
			return false;
		}

		logger.info("socketIO:Emit", data);
		// socket.broadcast.to( data.channel ).emit('message', data.message );
		// socket.emit('message', data.message );
		io.sockets.in(data.channel).emit('message', data.message + "-" + new Date().getTime());
		logger.info("IP ADDRESS OF CLIENT " + socket.handshake.address);
	});
	
	socket.on("getIP", function (data) {
		io.sockets.in(data.channel).emit('message', socket.handshake.address);
	});
};
