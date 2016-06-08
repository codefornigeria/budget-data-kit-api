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
    agencyId : {
        model : 'mda'
    },
    agency : {
        type :'json'
    },
    ministryId : {
        model : 'ministry'
    },
    ministry : {
        type:'json'
    },
    cost : {
        type : 'string'
    },
    districtId : {
        model : 'district'
    },
    district : {
        type:'json'
    },
    consistuencyId : {
        model :'constituency'
    },
    constituency : {
        type:'json'
    },
    stateConstituencyId : {
        model : 'stateconstituency'
    },
    stateConstituency : {
        type :'json'
    },
    stateId : {
        model :'state'
    },
    state : {
        type :'json'
    },
    lgaId : {
        model : 'lga'
    },
    lga : {
        type :'json'
    },
    wardId : {
        model :'ward'
    },
    ward: {
        type :'json'
    },
    personId : {
        model : 'person'
    },
    person:{
        type :'json'
    },
    projectState : {
        type : 'string'

    },
    startDate : {
        type : 'date'
    },
    endDate : {
        type : 'date'
    },
      isDeleted: {
            type : 'boolean',
            defaultsTo : false
        }
  }
};

