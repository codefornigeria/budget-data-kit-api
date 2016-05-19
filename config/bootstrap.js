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

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // 
  // 
  
  var loadCountry =  function(setup) {
           fs.readFile(sails.config.appPath + '/assets/state.json', function(err, statedata) {
            if (err) {
                console.log(err)
            }

            var stateDataJson = JSON.parse(statedata);
            stateDataJson.features.forEach(function(cstate){
                 var data = {
                
                geo_level: 'state',
                geo_code: cstate.properties.code,
                name: cstate.properties.name,
                year: '',
                parent_level: 'country',
                parent_code: 'NG'
            }
            stateGeo.push(data)
            })
  }

  var loadState  = function(setup) {
       fs.readFile(sails.config.appPath + '/assets/state.json', function(err, statedata) {
            if (err) {
                console.log(err)
            }

            var stateDataJson = JSON.parse(statedata);
            stateDataJson.features.forEach(function(cstate){
                 var data = {
                
                geo_level: 'state',
                geo_code: cstate.properties.code,
                name: cstate.properties.name,
                year: '',
                parent_level: 'country',
                parent_code: 'NG'
            }
            stateGeo.push(data)
            })
  }

  var loadLga = function(setup) {
       fs.readFile(sails.config.appPath + '/assets/state.json', function(err, statedata) {
            if (err) {
                console.log(err)
            }

            var stateDataJson = JSON.parse(statedata);
            stateDataJson.features.forEach(function(cstate){
                 var data = {
                
                geo_level: 'state',
                geo_code: cstate.properties.code,
                name: cstate.properties.name,
                year: '',
                parent_level: 'country',
                parent_code: 'NG'
            }
            stateGeo.push(data)
            })
  }

  var loadWard  = function(setup){
           fs.readFile(sails.config.appPath + '/assets/state.json', function(err, statedata) {
            if (err) {
                console.log(err)
            }

            var stateDataJson = JSON.parse(statedata);
            stateDataJson.features.forEach(function(cstate){
                 var data = {
                
                geo_level: 'state',
                geo_code: cstate.properties.code,
                name: cstate.properties.name,
                year: '',
                parent_level: 'country',
                parent_code: 'NG'
            }
            stateGeo.push(data)
            })
  }

  var loadProject = function(setup) {
           fs.readFile(sails.config.appPath + '/assets/state.json', function(err, statedata) {
            if (err) {
                console.log(err)
            }

            var stateDataJson = JSON.parse(statedata);
            stateDataJson.features.forEach(function(cstate){
                 var data = {
                
                geo_level: 'state',
                geo_code: cstate.properties.code,
                name: cstate.properties.name,
                year: '',
                parent_level: 'country',
                parent_code: 'NG'
            }
            stateGeo.push(data)
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
                    loadState(setup);
                }
                if (setup[0].lgaLoaded == false) {
                    // console.log('template is false')
                    loadLga(setup);
                }

                   if (setup[0].wardLoaded == false) {
                    // console.log('template is false')
                    loadWard(setup);
                }

                   if (setup[0].projectLoaded == false) {
                    // console.log('template is false')
                    loadProject(setup);
                }
            } else {
                Setup.create({}).then(function(newSetup) {
                    loadCountry(newSetup);
                    loadState(newSetup);
                    loadLga(newSetup);  
                    loadWard(newSetup);        
                    loadProject(newSetup);

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

  cb();
})   .catch(function(err) {
            console.log(err);
            console.log("Error checking for setup");
        });
};
