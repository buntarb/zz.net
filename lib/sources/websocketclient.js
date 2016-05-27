/**
 * @fileoverview Provide zz.net.WebSocketClient.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.WebSocketClient' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.net.WebSocket' );
goog.require( 'goog.net.WebSocket.EventType' );
goog.require( 'goog.json' );
goog.require( 'goog.array' );

goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.net.enums.ErrorType' );
goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.net.enums.MessageType' );
goog.require( 'zz.net.enums.ClientModeType' );

goog.require( 'zz.net.models.GreetingDataset' );
goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.models.ErrorDataset' );

goog.require( 'zz.net.events.WebSocketClientError' );
goog.require( 'zz.net.events.WebSocketClientOpen' );
goog.require( 'zz.net.events.WebSocketClientClose' );
goog.require( 'zz.net.events.WebSocketClientMessage' );

/**
 * Web socket client class.
 * @param {string} url
 * @param {string} opt_protocol
 * @constructor
 * @extends {goog.events.EventTarget}
 */
zz.net.WebSocketClient = function( url, opt_protocol ){

	goog.base( this );

	/**
	 * Client mode.
	 * @type {zz.net.enums.ClientModeType|number}
	 * @private
	 */
	this.mode_ = zz.environment.services.Environment.getInstance( ).isNode( ) ?

		zz.net.enums.ClientModeType.NODE_WS_WEB_SOCKET :
		zz.net.enums.ClientModeType.GOOG_NET_WEB_SOCKET;

	/**
	 * WebSocket event target element.
	 * @type {ws.WebSocket|goog.net.WebSocket}
	 * @private
	 */
	this.wsc_;

	/**
	 * Current client path.
	 * @type {string}
	 * @private
	 */
	this.path_;

	/**
	 * Supported commands list.
	 * @type {Array<string>}
	 * @private
	 */
	this.commands_ = [ ];

	/**
	 * Supported resources list.
	 * @type {Array<string>}
	 * @private
	 */
	this.resources_ = [ ];

	if( this.mode_ === zz.net.enums.ClientModeType.NODE_WS_WEB_SOCKET ){

		var idk = require( 'imazzine-developer-kit' );
		var WebSocket = idk.ws;
		this.wsc_ = new WebSocket( url, opt_protocol );
		this.wsc_.on(

			zz.net.enums.EventType.WEB_SOCKET_ERROR,
			goog.bind( this.errorHandler_, this ) );

		this.wsc_.on(

			zz.net.enums.EventType.WEB_SOCKET_OPEN,
			goog.bind( this.openHandler_, this ) );

		this.wsc_.on(

			zz.net.enums.EventType.WEB_SOCKET_CLOSE,
			goog.bind( this.closeHandler_, this ) );

		this.wsc_.on(

			zz.net.enums.EventType.WEB_SOCKET_MESSAGE,
			goog.bind( this.messageHandler_, this ) );

	}else if( this.mode_ === zz.net.enums.ClientModeType.GOOG_NET_WEB_SOCKET ){

		this.wsc_ = new goog.net.WebSocket( );
		this.handler_ = new goog.events.EventHandler( );
		this.handler_.listenWithScope(

			this.wsc_,
			goog.net.WebSocket.EventType.ERROR,
			this.errorHandler_,
			false,
			this );

		this.handler_.listenWithScope(

			this.wsc_,
			goog.net.WebSocket.EventType.OPENED,
			this.openHandler_,
			false,
			this );

		this.handler_.listenWithScope(

			this.wsc_,
			goog.net.WebSocket.EventType.CLOSED,
			this.closeHandler_,
			false,
			this );

		this.handler_.listenWithScope(

			this.wsc_,
			goog.net.WebSocket.EventType.MESSAGE,
			this.messageHandler_,
			false,
			this );

		this.wsc_.open( url, opt_protocol );
	}
};
goog.inherits( zz.net.WebSocketClient, goog.events.EventTarget );

/**
 * @override
 */
zz.net.WebSocketClient.prototype.disposeInternal = function( ){

	goog.base( this, 'disposeInternal' );

	this.handler_.dispose( );
	this.handler_ = undefined;
	delete this.handler_;

	// TODO (buntarb): Define how to unwatch ws.WebSocket events to avoid memory leaks.
	this.wsc_ = undefined;
	delete this.wsc_;
};

/**
 * Add command to supported list.
 * @param {string} command
 * @protected
 */
zz.net.WebSocketClient.prototype.addSupportedCommandInternal = function( command ){

	this.commands_.push( command );
};

/**
 * Add resource to supported list.
 * @param {string} resource
 * @protected
 */
zz.net.WebSocketClient.prototype.addSupportedResourceInternal = function( resource ){

	this.resources_.push( resource );
};

/**
 * Socket error event handler.
 * @param err
 * @private
 */
zz.net.WebSocketClient.prototype.errorHandler_ = function( err ){

	if( goog.DEBUG ){

		console.log( 'Web socket client error: ', err, this );
	}
	this.dispatchEvent( new zz.net.events.WebSocketClientError( this, err ) );
};

/**
 * Socket open event handler.
 * @private
 */
zz.net.WebSocketClient.prototype.openHandler_ = function( ){

	if( goog.DEBUG ){

		console.log( 'Web socket client open: ', this );
	}
	this.dispatchEvent( new zz.net.events.WebSocketClientOpen( this ) );
};

/**
 * Socket close event handler.
 * @private
 */
zz.net.WebSocketClient.prototype.closeHandler_ = function( ){

	if( goog.DEBUG ){

		console.log( 'Web socket client close: ', this );
	}
	this.dispatchEvent( new zz.net.events.WebSocketClientClose( this ) );
};

/**
 * Socket message event handler.
 * @param {goog.net.WebSocket.MessageEvent|string} input
 * @private
 */
zz.net.WebSocketClient.prototype.messageHandler_ = function( input ){

	var data;
	if( this.mode_ === zz.net.enums.ClientModeType.NODE_WS_WEB_SOCKET ){

		data = input;

	}else if( this.mode_ === zz.net.enums.ClientModeType.GOOG_NET_WEB_SOCKET ){

		data = input.message;
	}
	var dataset = new zz.net.models.MessageDataset( null, goog.json.unsafeParse( data ) );
	var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
	if( datarow ){

		do{

			if( datarow.type === zz.net.enums.MessageType.GREETING ){

				this.path_ = datarow.target;
				this.sendGreetingMessage( );

			}else{

				this.dispatchEvent(

					new zz.net.events.WebSocketClientMessage(

						this,
						datarow.type,
						datarow.source,
						datarow.target,
						JSON.parse( data ) ) );
			}
		}while( datarow = dataset.nextDatarow( ) );
	}

	if( goog.DEBUG ){

		console.log( 'Web socket client message: ', this );
	}
};

/**
 * Checks to see if the web socket is open or not.
 * True if the web socket is open, false otherwise.
 * @returns {boolean}
 */
zz.net.WebSocketClient.prototype.isOpen = function( ){

	if( this.mode_ === zz.net.enums.ClientModeType.NODE_WS_WEB_SOCKET ){

		return this.wsc_.readyState === WebSocket.OPEN;

	}else if( this.mode_ === zz.net.enums.ClientModeType.GOOG_NET_WEB_SOCKET ){

		return this.wsc_.isOpen( );
	}
	return false;
};

/**
 * Sending data to server.
 * @param {string} data
 */
zz.net.WebSocketClient.prototype.send = function( data ){

	this.wsc_.send( data );
};

/**
 * Sending message to target
 * @param {number} type
 * @param {string} target
 * @param {zz.models.Dataset} dataset
 */
zz.net.WebSocketClient.prototype.sendMessage = function( type, target, dataset ){

	var msgset = new zz.net.models.MessageDataset( );
	var msgrow = /** @type {zz.net.models.MessageDatarow} */ ( msgset.createLast( ) );

		msgrow.type = type;
		msgrow.source = this.path_;
		msgrow.target = target;
		msgrow.data = goog.json.serialize( dataset.serializeDataset( ) );

	this.send( goog.json.serialize( msgset.serializeDataset( ) ) );
};

/**
 * Sending command message.
 * @param {string} target
 * @param {number} code
 * @param {string} message
 */
zz.net.WebSocketClient.prototype.sendErrorMessage = function( target, code, message ){

	var errorDataset = new zz.net.models.ErrorDataset( );
	var errorDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( errorDataset.createLast( ) );

		errorDatarow.code = code;
		errorDatarow.message = message;

	return this.sendMessage( zz.net.enums.MessageType.ERROR, target, errorDataset );
};

/**
 *
 * @returns {*}
 */
zz.net.WebSocketClient.prototype.sendGreetingMessage = function( ){

	var greetingDataset = new zz.net.models.GreetingDataset( );
	var greetingDatarow;
	goog.array.forEach( this.commands_, function( cmd ){

		greetingDatarow = greetingDataset.createLast( );
		greetingDatarow.type = zz.net.enums.MessageType.COMMAND;
		greetingDatarow.name = cmd;
	} );
	goog.array.forEach( this.resources_, function( resource ){

		greetingDatarow = greetingDataset.createLast( );
		greetingDatarow.type = zz.net.enums.MessageType.RESOURCE;
		greetingDatarow.name = resource;
	} );
	return this.sendMessage( zz.net.enums.MessageType.GREETING, this.path_, greetingDataset );
};

/**
 * Sending command message.
 * @param {string} command
 * @param {zz.models.Dataset} dataset
 */
zz.net.WebSocketClient.prototype.sendCommandMessage = function( command, dataset ){

	return this.sendMessage( zz.net.enums.MessageType.COMMAND, command, dataset );
};

/**
 * Sending resource message.
 * @param {string} resource
 * @param {zz.models.Dataset} dataset
 */
zz.net.WebSocketClient.prototype.sendResourceMessage = function( resource, dataset ){

	return this.sendMessage( zz.net.enums.MessageType.RESOURCE, resource, dataset );
};