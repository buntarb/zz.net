/**
 * @fileoverview Provide zz.net.events.WebSocketClientClose.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.events.WebSocketClientClose' );

goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.net.enums.EventType' );

/**
 * @param {zz.net.WebSocketClient} socket
 * @constructor
 * @extends {zz.events.BaseEvent}
 */
zz.net.events.WebSocketClientClose = function( socket ){

	goog.base( this, zz.net.enums.EventType.WEB_SOCKET_CLOSE );

	/**
	 * Web socket client.
	 * @type {zz.net.WebSocketClient}
	 */
	this.socket = socket;
};
goog.inherits( zz.net.events.WebSocketClientClose, zz.events.BaseEvent );