/**
 * Setup.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    countryLoaded : {
        type : 'boolean',
        defaultsTo:false
    },
    stateLoaded : {
        type : 'boolean',
        defaultsTo:false
    },
    lgaLoaded : {
        type : 'boolean',
        defaultsTo:false
    },
       wardLoaded : {
        type : 'boolean',
        defaultsTo:false
    },
       projectLoaded : {
        type : 'boolean',
        defaultsTo:false
    }
  }
};

