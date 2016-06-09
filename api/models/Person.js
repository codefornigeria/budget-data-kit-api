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
        stateId: {
            model: 'state'
        },
        state: {
            type :'json'
        },
        constituencyId: {
            model: 'constituency'
        },
        constituency : {
            type : 'json'
        },
        districtId: {
            model: 'district'
        },
        district : {
            type : 'json'
        },
        projects:{
            collection:'project',
            via:'personId'
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
