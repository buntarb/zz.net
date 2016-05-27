/**
 * @fileoverview Provide zz.net.events.WebSocketClientOpen.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.events.WebSocketClientOpen' );

goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.net.enums.EventType' );

/**
 * @param {zz.net.WebSocketClient} socket
 * @constructor
 * @extends {zz.events.BaseEvent}
 */
zz.net.events.WebSocketClientOpen = function( socket ){

	goog.base( this, zz.net.enums.EventType.WEB_SOCKET_OPEN );

	/**
	 * Web socket client.
	 * @type {zz.net.WebSocketClient}
	 */
	this.socket = socket;
};
goog.inherits( zz.net.events.WebSocketClientOpen, zz.events.BaseEvent );