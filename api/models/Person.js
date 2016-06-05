/**
 * Project.js
 *
 * @description ::  You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var slug = require('slug');
    module.exports = {
    attributes: {
        name: {
            type: 'string'
        },
        slug:{
            type:'string'
        },
        gender: {
            type: 'string',
            enum: ['male', 'female']
        },
        email: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        state: {
            model: 'state'
        },
        constituency: {
            model: 'constituency'
        },
        district: {
            model: 'district'
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        }
    },
    beforeCreate: function (values, cb) {
        values.slug = slug(values.name, {lower: true});
        cb();
    }
};
