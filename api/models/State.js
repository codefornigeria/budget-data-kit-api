/**
 * State.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    location : {
        type : 'json'
    },
    country : {
        model: 'country'
    },
    consistuencys : {
        collection :'constituency',
        via  : 'state'
    },
    districts : {
        collection :'district',
        via : 'state'
    },
    lgas: {
        collection :'lga',
        via : 'state'
    },
    wards  : {
        collection : 'ward',
        via : 'state'
    },
      isDeleted: {
            type : 'boolean',
            defaultsTo : false
        }
  }
};

