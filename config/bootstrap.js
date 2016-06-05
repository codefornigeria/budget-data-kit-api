/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var slug = require('slug');
var fs = require('fs');
module.exports.bootstrap = function(cb) {

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    // 
    // 
    var loadCountry = function(setup) {
        var countryData = {
            name: "Nigeria",
            isoCode: "NG",
            countryCode: "+234",
            lat: 8.0000,
            long: 10.0000,
            location: {
                type: "Point",
                coordinates: [10.0000, 8.0000]
            }
        };
        Country.create(countryData).exec(function cb(err, country) {
            if (err) {
                console.log(err)
            }
            if (country) {
                Setup.update(setup.id, {
                    countryLoaded: true
                }).exec(function cb(err, setup) {
                    loadStates(setup);
                    console.log("countries initialized successfully")
                });
            }
        });
    }

    var loadStates = function(setup) {
        var statesData = []
        sails.config.states.forEach(function(state) {
            var data = {
                name: state.name,
                countrySlug: 'nigeria',
                stateCode: state.state_code,
                lat: state.latitude,
                long: state.longitude,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(state.longitude), parseFloat(state.latitude)]
                }
            }
            statesData.push(data);
        })
        State.create(statesData).exec(function cb(err, states) {
            if (err) {
                console.log(err)
            }
            if (states) {
                Setup.update(setup.id, {
                    stateLoaded: true
                }).exec(function cb(err, setup) {
                    console.log("states initialized successfully")
                });
            }
        });
    }


    var loadLgas = function(setup) {
        var lgaDatas = []
        fs.readFile(sails.config.appPath + '/assets/lga.json', function(err, lgadata) {
            if (err) {
                console.log(err)
            }

            var lgaDataJson = JSON.parse(lgadata);
            lgaDataJson.features.forEach(function(lga) {
                var data = {
                    name: lga.properties.lganame,
                    lgaCode: lga.properties.lgacode,
                    amapCode: lga.properties.amapcode
                        // location: {
                        //     type: lga.geometry.type,
                        //     coordinates: lga.geometry.coordinates
                        // }
                }
                lgaDatas.push(data)
            })
            Lga.create(lgaDatas).exec(function cb(err, lgas) {
                if (err) {
                    console.log(err)
                }
                if (lgas) {
                    Setup.update(setup.id, {
                        lgaLoaded: true
                    }).exec(function cb(err, setup) {
                        console.log('lgas initialized successfully')
                    })
                }
            })
        })
    }



    // var loadWards = function(setup) {
    //         fs.readFile(sails.config.appPath + '/assets/ward.json', function(err, statedata) {
    //                 if (err) {
    //                     console.log(err)
    //                 }

    //                 var stateDataJson = JSON.parse(statedata);
    //                 stateDataJson.features.forEach(function(cstate) {
    //                     var data = {

    //                         geo_level: 'state',
    //                         geo_code: cstate.properties.code,
    //                         name: cstate.properties.name,
    //                         year: '',
    //                         parent_level: 'country',
    //                         parent_code: 'NG'
    //                     }
    //                     stateGeo.push(data)
    //                 })
    //             })
    //         }


    var loadDistricts = function(setup) {
        var districtsData = []
        sails.config.senators.forEach(function(senators) {
            var data = {
                name: senators.StateDistrict,
                stateSlug: slug(senators.State),
                // lat: state.latitude,
                // long: state.longitude,
                // location: {
                //     type: "Point",
                //     coordinates: [parseFloat(state.longitude), parseFloat(state.latitude)]
                // }
            }
            districtsData.push(data);
        })
        District.create(districtsData).exec(function cb(err, districts) {
            if (err) {
                console.log(err)
            }
            if (districts) {
                Setup.update(setup.id, {
                    districtLoaded: true
                }).exec(function cb(err, setup) {
                    console.log("districts initialized successfully")
                });
            }
        });
    }

    var loadConsistuencys = function(setup) {
        var constituencysData = []
        sails.config.representatives.forEach(function(reps) {
            var data = {
                name: reps.SURNAME + ' ' + reps.OTHERNAMES,
                stateSlug: slug(senators.State),
                // lat: state.latitude,
                // long: state.longitude,
                // location: {
                //     type: "Point",
                //     coordinates: [parseFloat(state.longitude), parseFloat(state.latitude)]
                // }
            }
            districtsData.push(data);
        })
        District.create(districtsData).exec(function cb(err, districts) {
            if (err) {
                console.log(err)
            }
            if (districts) {
                Setup.update(setup.id, {
                    districtLoaded: true
                }).exec(function cb(err, setup) {
                    console.log("districts initialized successfully")
                });
            }
        });
    }




    // var loadStateConsistuencys = function(setup) {
    //     fs.readFile(sails.config.appPath + '/assets/project.json', function(err, statedata) {
    //         if (err) {
    //             console.log(err)
    //         }

    //         var stateDataJson = JSON.parse(statedata);
    //         stateDataJson.features.forEach(function(cstate) {
    //             var data = {

    //                 geo_level: 'state',
    //                 geo_code: cstate.properties.code,
    //                 name: cstate.properties.name,
    //                 year: '',
    //                 parent_level: 'country',
    //                 parent_code: 'NG'
    //             }
    //             stateGeo.push(data)
    //         })
    //     })
    // }
    // var loadMinistrys = function(setup) {
    //     fs.readFile(sails.config.appPath + '/assets/ministry.json', function(err, statedata) {
    //         if (err) {
    //             console.log(err)
    //         }

    //         var stateDataJson = JSON.parse(statedata);
    //         stateDataJson.features.forEach(function(cstate) {
    //             var data = {

    //                 geo_level: 'state',
    //                 geo_code: cstate.properties.code,
    //                 name: cstate.properties.name,
    //                 year: '',
    //                 parent_level: 'country',
    //                 parent_code: 'NG'
    //             }
    //             stateGeo.push(data)
    //         })
    //     })
    // }
    // var loadMdas = function(setup) {
    //     fs.readFile(sails.config.appPath + '/assets/mda.json', function(err, statedata) {
    //         if (err) {
    //             console.log(err)
    //         }

    //         var stateDataJson = JSON.parse(statedata);
    //         stateDataJson.features.forEach(function(cstate) {
    //             var data = {

    //                 geo_level: 'state',
    //                 geo_code: cstate.properties.code,
    //                 name: cstate.properties.name,
    //                 year: '',
    //                 parent_level: 'country',
    //                 parent_code: 'NG'
    //             }
    //             stateGeo.push(data)
    //         })
    //     })
    // }

    var loadPersons = function(setup) {

        var personsData = []
        var senatorlength = sails.config.senators.length;
        var totalsaved = 0;
        sails.config.senators.forEach(function(senator) {
            var slug_name = slug(senator.State);
            var data = {};
            State.findOne({ slug: slug_name }).exec(function cb(err, state) {
                if (err) {
                    console.log('error retrieving state')
                }
                if (state) {
                    data.state = state.id
                }
                District.findOne({ slug: slug(senator.StateDistrict) }).exec(function cb(err, district) {
                    if (err) {
                        console.log('error with district')
                    }
                    if (district) {
                        data.district = district.id
                    }
                    data.name = senator.Name;
                    data.party = senator.Party;
                    data.phone = senator.Phone;
                    Person.create(data).exec(function cb(err, person) {
                        if (err) {
                            console.log('err creating person');
                            console.log(data)
                        }
                        console.log(person)
                        totalsaved++;

                        if (totalsaved == senatorlength) {
                            Setup.update(setup.id, {
                                personLoaded: true
                            }).exec(function cb(err, setup) {
                                console.log("persons initialized successfully")
                            });
                        }

                    })
                    personsData.push(data);
                })
            })



        })


    }

    var loadProjects = function(setup) {

        var projectsData = []
        var projectLength = sails.config.projects.length;
        var totalsaved = 0;
        sails.config.projects.forEach(function(project) {
            var data = {};
            data.description = project.ProjectDescription
            data.projectState = project.ProjectState
            data.agency = project.Agency
            data.ministry = project.Ministry
            data.cost = project.Amount
            District.findOne({ slug: slug(project.SenatorDistrict, { lower: true }) }).populate('state').exec(function cb(err, district) {
                if (err) {
                    console.log('error retrieving district')

                }
                if (district) {
                    data.district = district.id
                    data.state = district.state.id
                    Person.findOne({ district: district.id }).exec(function cb(err, person) {
                        if (err) {
                            console.log('person not found');
                        }
                        data.person = person.id
                        console.log(data)
                        Project.create(data).exec(function cb(err, project) {
                            if (err) {
                                console.log('err creating project');
                                console.log(data)
                            }
                            console.log(project)
                            totalsaved++;

                            if (totalsaved == 686) {
                                Setup.update(setup.id, {
                                    projectLoaded: true
                                }).exec(function cb(err, setup) {
                                    console.log("project initialized successfully")
                                });
                            }

                        })
                    })

                }
            })



        })


    }
    Setup.find().then(function(setup) {
        // console.log(setup)
        if (setup.length) {
            // console.log('setup  called')
            if (setup[0].countryLoaded == false) {
                loadCountry(setup);
            }
            if (setup[0].stateLoaded == false) {
                // console.log('template is false')
                loadStates(setup);
            }
            if (setup[0].lgaLoaded == false) {
                // console.log('template is false')
                loadLgas(setup);
            }

            // if (setup[0].wardLoaded == false) {
            //     // console.log('template is false')
            //     loadWards(setup);
            // }
            if (setup[0].districtLoaded == false) {
                // console.log('template is false')
                loadDistricts(setup);
            }
            if (setup[0].personLoaded == false) {
                // console.log('template is false')
                loadPersons(setup);
            }
            //if (setup[0].consistuencyLoaded == false) {
            //     // console.log('template is false')
            //     loadConsistuencys(setup);
            // }
            // if (setup[0].stateConsistuencyLoaded == false) {
            //     // console.log('template is false')
            //     loadStateConsistuencys(setup);
            // }
            // if (setup[0].ministryLoaded == false) {
            //     // console.log('template is false')
            //     loadMinistrys(setup);
            // }
            // if (setup[0].mdaLoaded == false) {
            //     // console.log('template is false')
            //     loadMdas(setup);
            // }
            if (setup[0].projectLoaded == false) {
                // console.log('template is false')
                loadProjects(setup);
            }
        } else {
            Setup.create({}).then(function(newSetup) {
                loadCountry(newSetup);
                loadStates(newSetup);
                loadLgas(newSetup);
                // loadWard(newSetup);
                loadDistricts(newSetup);
                loadPersons(newSetup);
                // loadConsistuency(newSetup);
                // loadStateConstituency(newSetup);
                // loadProjects(newSetup);

            });
        }


        Country.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });
        State.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });

        Lga.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });
        Ward.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });
        District.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });
        Constituency.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });
        StateConstituency.native(function(err, collection) {
            collection.ensureIndex({
                location: '2dsphere'
            }, function() {});
        });
        Person.native(function(err,collection){
            collection.ensureIndex({
                name : "text" , 
                party: "text",
                phone : "text",
                email: "text"
            })
        })
        Project.native(function(err,collection){
            collection.ensureIndex({
                description : "text",

            })
        })

        cb();
    }).catch(function(err) {
        console.log(err);
        console.log("Error checking for setup");
    });
};
