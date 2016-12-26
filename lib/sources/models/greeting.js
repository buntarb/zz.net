/**
 * @fileoverview Provide zz.net.models.Greeting.
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

goog.provide( 'zz.net.models.GreetingDatarow' );
goog.provide( 'zz.net.models.GreetingDataset' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );

/**
 * @param {zz.net.models.GreetingDataset} dataset
 * @param {array=} opt_data
 * @extends {zz.models.Datarow}
 * @constructor
 */
zz.net.models.GreetingDatarow = function( dataset, opt_data ){

	/**
	 * Supplied message type.
	 * @type {number}
	 */
	this.type;

	/**
	 * Supplied message name.
	 * @type {string}
	 */
	this.name;

	// Calling base class.
	goog.base( this, dataset, opt_data );
};
goog.inherits( zz.net.models.GreetingDatarow, zz.models.Datarow );

/**
 * @param {goog.event.EventTarget=} opt_parent
 * @param {array=} opt_data
 * @extends {zz.models.Dataset}
 * @constructor
 */
zz.net.models.GreetingDataset = function( opt_parent, opt_data ){

	goog.base( this, opt_parent, opt_data );
};
goog.inherits( zz.net.models.GreetingDataset, zz.models.Dataset );

/**
 * Current dataset row type.
 * @constructor
 * @type {zz.net.models.MessageDatarow}
 * @overwrite
 */
zz.net.models.GreetingDataset.prototype.DatarowConstructor = zz.net.models.GreetingDatarow;

/**
 * Return schema object.
 * @returns {Object}
 * @override
 */
zz.net.models.GreetingDataset.prototype.getDatarowSchema = function( ){

	return {

		type: {

			index: 0,
			type: zz.models.enums.FieldType.NUMBER,
			required: true
		},
		name: {

			index: 1,
			type: zz.models.enums.FieldType.STRING,
			required: true
		}
	};
};