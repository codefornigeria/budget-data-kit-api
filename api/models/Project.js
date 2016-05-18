/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    description : {
        type : 'string'
    },
    agency : {
        model : 'mda'
    },
    ministry : {
        model : 'ministry'
    },
    cost : {
        type : 'string'
    },
    district : {
        model : 'district'
    },
    consistuency : {
        model :'constituency'
    },
    stateConstituency : {
        model : 'stateconstituency'
    },
    lga : {
        model : 'lga'
    },
    ward : {
        model :'ward'
    },
    startDate : {
        type : 'date'
    },
    endDate : {
        type : 'date'
    }
  }
};

