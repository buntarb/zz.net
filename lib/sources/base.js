/**
 * @fileoverview Provide zz.net base object.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

if( typeof global !== 'undefined' &&
	typeof window === 'undefined' &&
	global.process.title === 'node' ){

	require( 'imazzine-developer-kit' );
}

goog.provide( 'zz.net' );
goog.require( 'zz.net.WebSocketServer' );

/**
 * Base namespace for zz.net module.
 * @const
 */
zz.net = zz.net || { };

/**
 * Bootstrap module method.
 */
zz.net.bootstrap = function( ){

	var wss = new zz.net.WebSocketServer( );
	console.log( wss );
};
if( typeof global !== 'undefined' &&
	typeof window === 'undefined' &&
	global.process.title === 'node' ){

	zz.net.bootstrap( );

}else{

	goog.exportSymbol( 'zz.net.bootstrap', zz.net.bootstrap );
}

