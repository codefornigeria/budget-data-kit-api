/**
 * Constituency.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var slug = require('slug');
module.exports = {

    attributes: {
        name: {
            type: 'string'
        },
        slug : {
            type :'string',
            unique:true
        },
        representative: {
            model: 'person'
        },
        stateId: {
            model: 'state'
        },
        state: {
            type :'json'
        },
          location: {
            type: 'json'
        },
        isDeleted: {
            type : 'boolean',
            defaultsTo : false
        }
    },
    beforeCreate: function(values, cb) {
        values.name = values.name.toLowerCase();
         values.slug = slug(values.name, {lower: true});

        cb();
    }

};
