/**
 * @fileoverview Provide zz.net.WebSocketServer.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.WebSocketServer' );

goog.require( 'goog.math' );
goog.require( 'goog.events.EventTarget' );

goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.net.enums.ErrorType' );
goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.net.enums.MessageType' );

goog.require( 'zz.net.models.GreetingDataset' );
goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.models.ErrorDataset' );

/**
 * Web socket server class.
 * @param {{
 * 	 host:string,
 * 	 port:number,
 * 	 path:string
 * }} options
 * @constructor
 * @extends {goog.events.EventTarget}
 */
zz.net.WebSocketServer = function( options ){

	goog.base( this );
	goog.getUid( this );
	if( zz.environment.services.Environment.getInstance( ).isNode( ) ){

		var idk = require( 'imazzine-developer-kit' );

		/**
		 * Ws object.
		 * @type {ws}
		 */
		var ws = idk.ws;

		/**
		 * Node WebSocket constructor.
		 * @constructor
		 */
		var ServerConstructor = ws.Server;

		/**
		 * Web socket server instance.
		 * @type {ws.Server}
		 * @private
		 */
		this.wss_ = new ServerConstructor( options );

		/**
		 * Current server path.
		 * @type {string}
		 * @private
		 */
		this.path_ = 'ws://' + this.wss_.options.host + ':' + this.wss_.options.port;

		/**
		 * WS client path - ws client hash.
		 * @type {Object}
		 * @private
		 */
		this.paths_ = { };

		/**
		 * Command - client with support hash.
		 * @type {Object}
		 * @private
		 */
		this.commands_ = { };

		/**
		 * Resource - client with support hash.
		 * @type {Object}
		 * @private
		 */
		this.resources_ = { };


		// Setting up base events handlers:

		this.wss_.on(

			zz.net.enums.EventType.WEB_SOCKET_SERVER_ERROR,
			goog.bind( this.serverErrorHandler_, this ) );

		this.wss_.on(

			zz.net.enums.EventType.WEB_SOCKET_SERVER_HEADERS,
			goog.bind( this.headersHandler_, this ) );

		this.wss_.on(

			zz.net.enums.EventType.WEB_SOCKET_SERVER_CONNECTION,
			goog.bind( this.connectionHandler_, this ) );

	}else{

		throw new Error( zz.net.enums.ErrorType.WEB_SOCKET_SERVER_ENVIRONMENT );
	}
};
goog.inherits( zz.net.WebSocketServer, goog.events.EventTarget );

/**
 * Web socket server error handler.
 * @param {Error} error
 * @private
 */
zz.net.WebSocketServer.prototype.serverErrorHandler_ = function( error ){

	console.log( error );
};

/**
 * Web socket server headers handler.
 * @param {Object} headers Connection http headers
 * @private
 */
zz.net.WebSocketServer.prototype.headersHandler_ = function( headers ){ };

/**
 * Web socket server connection handler.
 * @param {ws.WebSocket} socket
 * @private
 */
zz.net.WebSocketServer.prototype.connectionHandler_ = function( socket ){

	// Setting up ws events handlers.
	socket.on(

		zz.net.enums.EventType.WEB_SOCKET_ERROR,
		goog.bind( this.errorHandler_, this ) );

	socket.on(

		zz.net.enums.EventType.WEB_SOCKET_MESSAGE,
		goog.bind( this.messageHandler_, this, socket ) );

	// Sending greeting message.
	socket.send( '[[' +

		zz.net.enums.MessageType.GREETING + ',' +
		this.path_ + ',' +
		this.path_ + '/' + Date.now( ) + ',' +

	']]' );
};

/**
 * Web socket error handler.
 * @param {Error} error
 * @private
 */
zz.net.WebSocketServer.prototype.errorHandler_ = function( error ){

	console.log( error );
};

//noinspection JSUnusedLocalSymbols

/**
 * Web socket server message handler.
 * @param {ws.WebSocket} socket
 * @param {string} message
 * @param {{masked: boolean, binary: boolean}} flags
 * @this {zz.net.WebSocketServer}
 * @private
 */
zz.net.WebSocketServer.prototype.messageHandler_ = function( socket, message, flags ){

	var dataset = new zz.net.models.MessageDataset( null, JSON.parse( message ) );
	var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
	if( datarow ){

		do{

			if( datarow.type === zz.net.enums.MessageType.ERROR ){

				this.handleError_( socket, datarow );
			}
			if( datarow.type === zz.net.enums.MessageType.GREETING ){

				this.handleGreeting_( socket, datarow );
			}
			if( datarow.type === zz.net.enums.MessageType.COMMAND ){

				this.handleCommand_( socket, datarow );
			}
			if( datarow.type === zz.net.enums.MessageType.RESOURCE ){

				this.handleResource_( socket, datarow );
			}
		}while( datarow = dataset.nextDatarow( ) );
	}
};

/**
 * Greeting message processing.
 * @param {ws.WebSocket} socket
 * @param {zz.net.models.MessageDatarow} datarow
 * @this {zz.net.WebSocketServer}
 * @private
 */
zz.net.WebSocketServer.prototype.handleGreeting_ = function( socket, datarow ){

	this.paths_[ datarow.source ] = socket;
	var greetingDataset = new zz.net.models.GreetingDataset( datarow.data );
	var greetingDatarow = /** @type {zz.net.models.GreetingDatarow} */ ( greetingDataset.firstDatarow( ) );
	if( greetingDatarow ){

		do{

			if( greetingDatarow.type === zz.net.enums.MessageType.COMMAND ){

				/**
				 * Array of clients supported specified command.
				 * @type {Array}
				 */
				this.commands_[ greetingDatarow.name ] =

					this.commands_[ greetingDatarow.name ] || [ ];

				this.commands_[ greetingDatarow.name ].push( socket );

			}else if( greetingDatarow.type === zz.net.enums.MessageType.RESOURCE ){

				/**
				 * Array of clients supported specified resource.
				 * @type {Array}
				 */
				this.resources_[ greetingDatarow.name ] =

					this.resources_[ greetingDatarow.name ] || [ ];

				this.resources_[ greetingDatarow.name ].push( socket );
			}
			greetingDatarow = greetingDataset.nextDatarow( );

		}while( greetingDatarow );
	}
	socket.on(

		zz.net.enums.EventType.WEB_SOCKET_CLOSE,
		goog.bind( this.disconnectHandler_, this, datarow ) );
};

//noinspection JSUnusedLocalSymbols

/**
 * Web socket close connection handler.
 * @param {zz.net.models.MessageDatarow} datarow
 * @param {ws.WebSocket} socket
 * @param {number} code
 * @param {string} message
 * @this {zz.net.WebSocketServer}
 * @private
 */
zz.net.WebSocketServer.prototype.disconnectHandler_ = function( datarow, socket, code, message ){

	delete this.paths_[ datarow.source ];
	var greetingDataset = new zz.net.models.GreetingDataset( datarow.data );
	var greetingDatarow = /** @type {zz.net.models.GreetingDatarow} */ ( greetingDataset.firstDatarow( ) );
	if( greetingDatarow ){

		do{

			if( greetingDatarow.type === zz.net.enums.MessageType.COMMAND ){

				this.commands_[ greetingDatarow.name ]

					.splice( this.commands_[ greetingDatarow.name ].indexOf( socket ), 1 );

			}else if( greetingDatarow.type === zz.net.enums.MessageType.RESOURCE ){

				this.resources_[ greetingDatarow.name ]

					.splice( this.resources_[ greetingDatarow.name ].indexOf( socket ), 1 );
			}
			greetingDatarow = greetingDataset.nextDatarow( );

		}while( greetingDatarow );
	}
	console.log( this );
};

/**
 * Error message processing.
 * @param {ws.WebSocket} socket
 * @param {zz.net.models.MessageDatarow} datarow
 * @this {zz.net.WebSocketServer}
 * @private
 */
zz.net.WebSocketServer.prototype.handleError_ = function( socket, datarow ){

	if( !this.paths_[ datarow.target ] ){

		// TODO (buntarb): write logs to log file.
		console.log( '[' + Date.now( ) + '] Error. Can not proxy error message to undefined path: ' +

			datarow.target );

	}else{

		// Proxy error message to specified socket.
		this.paths_[ datarow.target ].send( '[[' +

			zz.net.enums.MessageType.ERROR + ',' +
			datarow.source + ',' +
			datarow.target + ',' +
			datarow.data +

		']]' );
	}
};

/**
 * Command message processing.
 * @param {ws.WebSocket} socket
 * @param {zz.net.models.MessageDatarow} datarow
 * @this {zz.net.WebSocketServer}
 * @private
 */
zz.net.WebSocketServer.prototype.handleCommand_ = function( socket, datarow ){

	if( !this.commands_[ datarow.target ] ){

		var errorDataset = new zz.net.models.ErrorDataset( );
		var errorDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( errorDataset.createLast( ) );
		errorDatarow.code = 0;
		errorDatarow.message = 'Command not found.';
		socket.send( '[[' +

			zz.net.enums.MessageType.ERROR + ',' +
			this.path_ + ',' +
			datarow.source + ',' +
			errorDataset.serializeDataset( ) +
			
		']]' );

	}else{

		// TODO (buntarb): Change it to work like load balancer.
		this.commands_[ datarow.target ][ goog.math.randomInt( this.commands_[ datarow.target ].length ) ]

			.send( '[[' +

				zz.net.enums.MessageType.COMMAND + ',' +
				datarow.source + ',' +
				datarow.target + ',' +
				datarow.data +

			']]' );
	}
};

/**
 * Resource message processing.
 * @param {ws.WebSocket} socket
 * @param {zz.net.models.MessageDatarow} datarow
 * @this {zz.net.WebSocketServer}
 * @private
 */
zz.net.WebSocketServer.prototype.handleResource_ = function( socket, datarow ){

	if( !this.resources_[ datarow.target ] ){

		var errorDataset = new zz.net.models.ErrorDataset( );
		var errorDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( errorDataset.createLast( ) );
		errorDatarow.code = 0;
		errorDatarow.message = 'Command not found.';
		socket.send( '[[' +

			zz.net.enums.MessageType.ERROR + ',' +
			this.path_ + ',' +
			datarow.source + ',' +
			errorDataset.serializeDataset( ) +

			']]' );

	}else{

		// TODO (buntarb): Change it to work like load balancer.
		this.resources_[ datarow.target ][ goog.math.randomInt( this.resources_[ datarow.target ].length ) ]

			.send( '[[' +

				zz.net.enums.MessageType.RESOURCE + ',' +
				datarow.source + ',' +
				datarow.target + ',' +
				datarow.data +

			']]' );
	}
};