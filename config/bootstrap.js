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


  var updateProjectCost = function() {
    var promiseArray = [];

    Project.find().then(function(projects) {
      if (!projects.length) {
        return false;
      }

      for (var i = 0, len = projects.length; i < len; i++) {
        if (!projects[i].id) {
          continue;
        }

        projects[i].cost = parseFloat(projects[i].cost);
        projects[i].matched = false;
        try {
          promiseArray.push(Project.update({
            id: projects[i].id
          }, projects[i]));
        } catch (e) {
          return ResponseService.json(500, res, "Internal Error: Please check inputs");
        }
      }
      Promise.all(promiseArray).then(function(projects) {
        return ResponseService.json(200, res, "Projects updated successfully", projects);
      });
    }).catch(function(err) {
      return ValidationService.jsonResolveError(err, res);
    })



  }
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
        name: state.name.toLowerCase(),
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
          name: lga.properties.lganame.toLowerCase(),
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
        name: senators.StateDistrict.toLowerCase(),
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
    async.waterfall([function(callback) {
          setTimeout(function() {
            async.map(sails.config.representatives, getState, function(err, results) {

              if (err) {
                console.log(err)
              }
              callback(null, results);
            })
          }, 1000)
        },

        function(result, callback) {
          console.log(result);
          // Constituency.create(constituencysData).exec(function cb(err, constituencys) {
          //   if (err) {
          //     callback(err)
          //   }
          //   callback(null, constituencys);
          //
          // });
        }
      ],
      function(err, results) {
        if (err) {
          console.log(err);
        }
        if (results) {
          // Setup.update(setup.id, {
          //   constituencyLoaded: true
          // }).exec(function cb(err, setup) {
          //   console.log("constituencies initialized successfully")
          // });
        }
      })
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
      State.findOne({
        slug: slug_name
      }).exec(function cb(err, state) {
        if (err) {
          console.log('error retrieving state')
        }
        if (state) {
          data.stateId = state.id
          data.state = state
        }
        District.findOne({
          slug: slug(senator.StateDistrict)
        }).exec(function cb(err, district) {
          if (err) {
            console.log('error with district')
          }
          if (district) {
            data.districtId = district.id
            data.district = district
          }
          data.name = senator.Name.toLowerCase();
          data.party = senator.Party.toLowerCase();
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
  var getState = function(rep, callback) {

    var data = {}
    State.findOne({
      slug: slug(rep.STATE)
    }).exec(function cb(err, state) {
      if (err) {
        console.log('show state');
        callback(err);
      }
      if (state) {

        data.stateId = state.id
        data.state = state
      }
      data.name = rep.SURNAME + ' ' + rep.OTHERNAMES;

      callback(null, data);
    })
  }

  var getConstituency = function(repdata, callback) {
    console.log(repdata);
    Constituency.findOne({
      slug: slug(repdata.FEDERALCONSTITUENCY)
    }).exec(function cb(err, constituency) {
      if (err) {
        console.log(err);
      }
      if (constituency) {
        repdata.constituencyId = constituency.id
        repdata.constituency = constituency
      }
      repdata.name = repdata.SURNAME + ' ' + repdata.OTHERNAMES;
      repdata.email = repdata.MAILADDRESS;
      repdata.phone = repdata.MOBILE;
      repdata.party = repdata.PARTY
      delete repdata.SURNAME;
      delete repdata.OTHERNAMES;
      delete repdata.PARTY;
      delete repdata.MOBILE;
      callback(null, repdata);
    })
  }




  var loadRepresentative = function(setup) {
    async.waterfall([
        function(callback) {
          var personsData = []
          var senatorlength = sails.config.representatives.length;
          var totalsaved = 0;
          setTimeout(function() {
            async.map(sails.config.representatives, getConstituency, function(err, results) {

              if (err) {
                console.log(err)
              }

              callback(null, results);
            })
          }, 1000)

        }


        // function( persondata, callback){
        //   var personsData = []
        //   var senatorlength = sails.config.representatives.length;
        //   var totalsaved = 0;
        //   setTimeout(function(){
        //     async.map(sails.config.representatives ,getState , function(err, results) {
        //     if(err) {
        //     console.log(err)
        //   }
        //
        //   callback(null,results);
        //   } )
        // } , 1000 )
        //
        //
        //
        // } ,

        // function(personsdata, callback){
        //
        //   setTimeout(function(){
        //     async.map(personsdata ,getConstituency , function(err, results) {
        //     if(err) {
        //     console.log(err)
        //   }
        //
        //   callback(null,results);
        //   } )
        // } , 1000 )
        //
        // }
      ], function(err, results) {
        if (err) {
          console.log(err);
        }
        console.log(results);
      })
      // var personsData = []
      // var senatorlength = sails.config.representatives.length;
      // var totalsaved = 0;
      // sails.config.representatives.forEach(function(rep) {
      //
      //      var slug_name = slug(rep.STATE);
      //     var data = {};
      //
      //     State.findOne({ slug: slug_name }).exec(function cb(err, state) {
      //         if (err) {
      //             console.log('show state');
      //             console.log(err)
      //         }
      //         if (state) {
      //             data.stateId = state.id
      //             data.state = state
      //         }
      //         Constituency.findOne({ slug: slug(rep.Constituency) }).exec(function cb(err, constituency) {
      //             if (err) {
      //                 console.log('error with constituency')
      //             }
      //             if (constituency) {
      //                 data.constituencyId = constituency.id
      //                 data.constituency = constituency
      //             }
      //             data.name = rep.Name.toLowerCase();
      //             data.party = rep.Party.toLowerCase();
      //             data.phone = rep.Phone;
      //             Person.create(data).exec(function cb(err, person) {
      //                 if (err) {
      //                     console.log('err creating person');
      //                     console.log(data)
      //                 }
      //                 console.log(person)
      //                 totalsaved++;
      //
      //                 if (totalsaved == senatorlength) {
      //                     Setup.update(setup.id, {
      //                         repLoaded: true
      //                     }).exec(function cb(err, setup) {
      //                         console.log("persons initialized successfully")
      //                     });
      //                 }
      //
      //             })
      //             personsData.push(data);
      //         })
      //     })
      //
      //
      //
      // })


  }

  var loadProjects = function(setup) {

    var projectsData = []
    var projectLength = sails.config.projects.length;
    var totalsaved = 0;
    sails.config.projects.forEach(function(project) {
      var data = {};
      data.description = project.ProjectDescription.toLowerCase();
      data.projectState = project.ProjectState.toLowerCase();
      data.agency = project.Agency.toLowerCase();
      data.ministry = project.Ministry.toLowerCase();
      data.cost = project.Amount
      District.findOne({
        slug: slug(project.SenatorDistrict, {
          lower: true
        })
      }).populate('state').exec(function cb(err, district) {
        if (err) {
          console.log('error retrieving district')

        }
        if (district) {
          data.districtId = district.id
          data.district = district
          data.stateId = district.state.id
          data.state = district.state
          Person.findOne({
            districtId: district.id
          }).exec(function cb(err, person) {
            if (err) {
              console.log('person not found');
            }
            data.personId = person.id
            data.person = person
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
    if (setup.length) {
      // updateProjectCost();
      //  if (setup[0].repLoaded == false) {
      //     loadRepresentative(setup);
      // }
      //     if (setup[0].countryLoaded == false) {
      //         loadCountry(setup);
      //     }
      //     if (setup[0].stateLoaded == false) {
      //         loadStates(setup);
      //     }
      //     if (setup[0].lgaLoaded == false) {
      //         loadLgas(setup);
      //     }
      //
      //     if (setup[0].districtLoaded == false) {
      //         loadDistricts(setup);
      //     }
      //     if (setup[0].personLoaded == false) {
      //         loadPersons(setup);
      //     }
      //
      //     if (setup[0].projectLoaded == false) {
      //         // console.log('template is false')
      //         loadProjects(setup);
      //     }
      //
      if (setup[0].constituencyLoaded == false) {
        loadConsistuencys(setup);
      }
      //
    } else {
      Setup.create({}).then(function(newSetup) {
        loadCountry(newSetup);
        loadStates(newSetup);
        loadLgas(newSetup);
        loadDistricts(newSetup);
        loadPersons(newSetup);
        loadProjects(newSetup);
        loadRepresentative(newSetup);
        loadConsistuencys(newSetup);

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
    Person.native(function(err, collection) {
      collection.ensureIndex({
        name: "text",
        party: "text",
        phone: "text",
        email: "text"
      })
    })
    Project.native(function(err, collection) {
      collection.ensureIndex({
        description: "text",

      })
    })

    cb();
  }).catch(function(err) {
    console.log(err);
    console.log("Error checking for setup");
  });
};
