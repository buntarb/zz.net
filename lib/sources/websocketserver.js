/**
 * @fileoverview Provide zz.net.WebSocketServer.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.WebSocketServer' );

goog.require( 'goog.events.EventTarget' );

goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.net.enums.ErrorType' );

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
zz.net.WebSocketServer = function( ){

	goog.base( this );
	if( zz.environment.services.Environment.getInstance( ).isNode( ) ){

		var idk = require( 'imazzine-developer-kit' );

		/**
		 * Ws object.
		 * @type {ws.WebSocket}
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
		this.wss_ = new ServerConstructor( { port: 9999 } );

		this.wss_.on( 'connection', function connection( ws ){

			ws.on( 'message', function incoming( message ){

				console.log('received: %s', message);
			} );
			ws.send( 'something' );
		} );
	}else{

		throw new Error( zz.net.enums.ErrorType.WEB_SOCKET_SERVER_ENVIRONMENT );
	}
};
goog.inherits( zz.net.WebSocketServer, goog.events.EventTarget );