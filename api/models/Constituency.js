/**
 * Constituency.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
        state: {
            model: 'state'
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
