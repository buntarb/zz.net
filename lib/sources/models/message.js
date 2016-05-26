/**
 * @fileoverview Provide zz.net.models.Message.
 * @license Apache-2.0
 * @author buntarb@gmail.com (Artem Lytvynov)
 */

goog.provide( 'zz.net.models.MessageDatarow' );
goog.provide( 'zz.net.models.MessageDataset' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );

/**
 * @param {zz.net.models.MessageDataset} dataset
 * @param {array=} opt_data
 * @extends {zz.models.Datarow}
 * @constructor
 */
zz.net.models.MessageDatarow = function( dataset, opt_data ){

	// Calling base class.
	goog.base( this, dataset, opt_data );

	/**
	 * Message type.
	 * @type {number}
	 */
	this.type;

	/**
	 * Message source path.
	 * @type {string}
	 */
	this.source;

	/**
	 * Message target path/command/resource.
	 * @type {string}
	 */
	this.target;

	/**
	 * Message data.
	 * @type {string}
	 */
	this.data;
};
goog.inherits( zz.net.models.MessageDatarow, zz.models.Datarow );

/**
 * @param {goog.event.EventTarget=} opt_parent
 * @param {array=} opt_data
 * @extends {zz.models.Dataset}
 * @constructor
 */
zz.net.models.MessageDataset = function( opt_parent, opt_data ){

	goog.base( this, opt_parent, opt_data );
};
goog.inherits( zz.net.models.MessageDataset, zz.models.Dataset );

/**
 * Current dataset row type.
 * @constructor
 * @type {zz.net.models.MessageDatarow}
 * @overwrite
 */
zz.net.models.MessageDataset.prototype.DatarowConstructor = zz.net.models.MessageDatarow;

/**
 * Return schema object.
 * @returns {Object}
 * @override
 */
zz.net.models.MessageDataset.prototype.getDatarowSchema = function( ){

	return {

		type: {

			index: 0,
			type: zz.models.enums.FieldType.NUMBER,
			required: true
		},
		source: {

			index: 1,
			type: zz.models.enums.FieldType.STRING,
			required: true
		},
		target: {

			index: 2,
			type: zz.models.enums.FieldType.STRING,
			required: true
		},
		data: {

			index: 2,
			type: zz.models.enums.FieldType.STRING,
			required: false
		}
	};
};