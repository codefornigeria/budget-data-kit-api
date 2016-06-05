/**
 * Country.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var slug = require('slug');

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        slug: {
            type: 'string',
            unique: true
        },
        isoCode: {
            type: 'string',
            required: true
        },
        countryCode: {
            type: 'string',
            required: true
        },
        long: {
            type: 'float'
        },
        lat: {
            type: 'float'
        },
        states: {
            collection: 'state',
            via: 'country'
        },
        location: {
            type: 'json'
        },
          isDeleted: {
            type : 'boolean',
            defaultsTo : false
        }
    },
       validationMessages: {
        name: {
            string: 'Please provide country name',
            required: 'Please provide country name'
        },
        slug: {
            unique: 'Country with that slug already exists'
        },
        isoCode: {
            string: 'Please provide country isoCode',
            required: 'Please provide country isoCode'
        },
        countryCode: {
            string: 'Please provide country code',
            required: 'Please provide country code'
        },
        long: {
            float: 'Please provide a valid float for longitude'
        },
        lat: {
            float: 'Please provide a valid float for latitude'
        }
    },
    beforeCreate: function (values, cb) {
        values.slug = slug(values.name, {lower: true});
        cb();
    }
    
};
