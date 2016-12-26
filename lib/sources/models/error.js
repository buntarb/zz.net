/**
 * @fileoverview Provide zz.net.models.Error.
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

goog.provide( 'zz.net.models.ErrorDatarow' );
goog.provide( 'zz.net.models.ErrorDataset' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );

/**
 * @param {zz.net.models.ErrorDatarow} dataset
 * @param {array=} opt_data
 * @extends {zz.models.Datarow}
 * @constructor
 */
zz.net.models.ErrorDatarow = function( dataset, opt_data ){

	/**
	 * Error code.
	 * @type {number}
	 */
	this.code;

	/**
	 * Error message.
	 * @type {string}
	 */
	this.message;

	// Calling base class.
	goog.base( this, dataset, opt_data );
};
goog.inherits( zz.net.models.ErrorDatarow, zz.models.Datarow );

/**
 * @param {goog.event.EventTarget=} opt_parent
 * @param {array=} opt_data
 * @extends {zz.models.Dataset}
 * @constructor
 */
zz.net.models.ErrorDataset = function( opt_parent, opt_data ){

	goog.base( this, opt_parent, opt_data );
};
goog.inherits( zz.net.models.ErrorDataset, zz.models.Dataset );

/**
 * Current dataset row type.
 * @constructor
 * @type {zz.net.models.MessageDatarow}
 * @overwrite
 */
zz.net.models.ErrorDataset.prototype.DatarowConstructor = zz.net.models.ErrorDatarow;

/**
 * Return schema object.
 * @returns {Object}
 * @override
 */
zz.net.models.ErrorDataset.prototype.getDatarowSchema = function( ){

	return {

		code: {

			index: 0,
			type: zz.models.enums.FieldType.NUMBER,
			required: true
		},
		message: {

			index: 1,
			type: zz.models.enums.FieldType.STRING,
			required: true
		}
	};
};