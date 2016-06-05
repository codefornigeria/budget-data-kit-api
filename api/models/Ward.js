/**
 * Ward.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var slug = require('slug');
module.exports = {

    attributes: {
        lga: {
            model: 'lga'
        },
        state: {
            model: 'state'
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
        State.findOne({ slug: values.stateSlug }).exec(function countyCB(err, state) {
            if (!state) {
                values.state = null;
                cb()
            } else {
                values.state = state.id;
                Lga.findOne({slug : lgaSlug}).exec(function lgaCB(err,lga){
                    if(!lga){
                        values.lga = null
                        cb()
                    }else{
                        values.lga=lga.id;
                        cb();
                    }
                })
        
            }
        });
    },
    beforeCreate: function(values, cb) {
        values.slug = slug(values.name, { lower: true });
        cb();
    }
};
