/**
 * Ward.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    lga : {
        model : 'lga'
    },
    state : {
        model :'state'
    },
    location : {
        type : 'json'
    },
      isDeleted: {
            type : 'boolean',
            defaultsTo : false
        }
  }
};

