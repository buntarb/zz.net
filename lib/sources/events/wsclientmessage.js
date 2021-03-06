// Copyright 2016 Artem Lytvynov <buntarb@gmail.com>. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

goog.provide( 'zz.net.events.WebSocketClientMessage' );

goog.require( 'goog.json' );

goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.net.enums.EventType' );

/**
 * @param {zz.net.WebSocketClient} socket
 * @param {string|number} type
 * @param {string} source
 * @param {string} target
 * @param {Array} data
 * @extends {zz.events.BaseEvent}
 * @constructor
 */
zz.net.events.WebSocketClientMessage = function( socket, type, source, target, data ){

	// goog.base( this, zz.net.enums.EventType.WEB_SOCKET_MESSAGE );
	goog.base( this, type );

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

/**
 * Return unparsed data string.
 * @return {string}
 */
zz.net.events.WebSocketClientMessage.prototype.getDataString = function( ){

	return this.messageData[ 0 ][ 4 ];
};

/**
 * Return parsed data JSON.
 * @return {JSON}
 */
zz.net.events.WebSocketClientMessage.prototype.getDataJson = function( ){

	return goog.json.parse( this.messageData[ 0 ][ 4 ] );
};