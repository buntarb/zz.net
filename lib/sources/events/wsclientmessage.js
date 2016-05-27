/**
 * @fileoverview Provide zz.net.events.WebSocketClientMessage.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.events.WebSocketClientMessage' );

goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.net.enums.EventType' );

/**
 * @param {zz.net.WebSocketClient} socket
 * @param {zz.net.enums.MessageType|number} type
 * @param {string} source
 * @param {string} target
 * @param {Array} data
 * @extends {zz.events.BaseEvent}
 * @constructor
 */
zz.net.events.WebSocketClientMessage = function( socket, type, source, target, data ){

	goog.base( this, zz.net.enums.EventType.WEB_SOCKET_MESSAGE );

	/**
	 * Web socket client.
	 * @type {zz.net.WebSocketClient}
	 */
	this.socket = socket;

	/**
	 * Message initiator.
	 * @type {string}
	 */
	this.messageSource = source;

	/**
	 * Message target.
	 * @type {string}
	 */
	this.messageTarget = target;

	/**
	 * Message dataset.
	 * @type {Array}
	 */
	this.messageData = data;
};
goog.inherits( zz.net.events.WebSocketClientMessage, zz.events.BaseEvent );