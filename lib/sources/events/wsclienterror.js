/**
 * @fileoverview Provide zz.net.events.WebSocketClientError.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.events.WebSocketClientError' );

goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.net.enums.EventType' );

/**
 * @param {zz.net.WebSocketClient} socket
 * @param {*} error
 * @constructor
 * @extends {zz.events.BaseEvent}
 */
zz.net.events.WebSocketClientError = function( socket, error ){

	goog.base( this, zz.net.enums.EventType.WEB_SOCKET_ERROR );

	/**
	 * Web socket client.
	 * @type {zz.net.WebSocketClient}
	 */
	this.socket = socket;

	/**
	 * Original error object.
	 * @type {Object}
	 */
	this.originalError = error;
};
goog.inherits( zz.net.events.WebSocketClientError, zz.events.BaseEvent );