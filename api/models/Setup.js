/**
 * Setup.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        countryLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        stateLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        lgaLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        wardLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        districtLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        constituencyLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        stateConstituencyLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        ministryLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        mdaLoaded: {
            type: 'boolean',
            defaultsTo: false
        },
        personLoaded :{
            type :'boolean',
            defaultsTo: false
        },
         repLoaded :{
            type :'boolean',
            defaultsTo: false
        },
        projectLoaded: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
