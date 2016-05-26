/**
 * @fileoverview Provide zz.net.enums.EventType.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.enums.EventType' );

/**
 * Enum for zz.net events types.
 * @enum {string}
 */
zz.net.enums.EventType = {

	WEB_SOCKET_SERVER_ERROR: 'error',
	WEB_SOCKET_SERVER_HEADERS: 'headers',
	WEB_SOCKET_SERVER_CONNECTION: 'connection',
	WEB_SOCKET_ERROR: 'error',
	WEB_SOCKET_OPEN: 'open',
	WEB_SOCKET_CLOSE: 'close',
	WEB_SOCKET_MESSAGE: 'message'
};