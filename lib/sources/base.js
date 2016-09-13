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

if( typeof global !== 'undefined' &&
	typeof window === 'undefined' &&
	~global.process.title.indexOf( 'node' ) ){

	require( 'imazzine-developer-kit' );
}

goog.provide( 'zz.net' );
goog.require( 'zz.net.WebSocketServer' );

/**
 * Bootstrap module method.
 */
zz.net.bootstrap = function( ){

	var wss = new zz.net.WebSocketServer( { port: 9999 } );
};

if( typeof global !== 'undefined' &&
	typeof window === 'undefined' &&
	~global.process.title.indexOf( 'node' ) ){

	zz.net.bootstrap( );

}else{

	goog.exportSymbol( 'zz.net.bootstrap', zz.net.bootstrap );
}

