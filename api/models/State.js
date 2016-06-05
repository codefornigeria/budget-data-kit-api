/**
 * State.js
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
        stateCode: {
            type: 'string',
            required: true
        },
        country: {
            model: 'country',
            required: true
        },
        consistuencys: {
            collection: 'constituency',
            via: 'state'
        },
        districts: {
            collection: 'district',
            via: 'state'
        },
        lgas: {
            collection: 'lga',
            via: 'state'
        },
        wards: {
            collection: 'ward',
            via: 'state'
        },

        long: {
            type: 'float'
        },
        lat: {
            type: 'float'
        },
        location: {
            type: 'json'
        },

        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        }
    },
     beforeValidate: function (values, cb) {
        Country.findOne({slug: values.countrySlug}).exec(function countyCB(err, country){
            if(!country){
                values.country = null;
                cb()
            } else {
                values.country = country.id;
                cb();
            }
        });
    },
    beforeCreate: function (values, cb) {
        values.slug = slug(values.name, {lower: true});
        cb();
    }
};
