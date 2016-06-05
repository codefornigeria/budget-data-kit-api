/**
 * Lga.js
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
        state: {
            model: 'state'
        },
        lgaCode : {
            type : 'string'
        },
        amapCode : {
            type : 'string'
        },
        location: {
            type: 'json'
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        }
    },
    beforeValidate: function(values, cb) {
        State.findOne({ stateCode: values.stateCode }).exec(function stateCB(err, state) {
            if (!state) {
                values.state = null;
                cb()
            } else {
                values.state = state.id;
                cb();
            }
        });
    },
    beforeCreate: function(values, cb) {
        values.slug = slug(values.name, { lower: true });
        cb();
    }
};
