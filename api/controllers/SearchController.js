/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
var pager = require('sails-pager');

module.exports = {

    /*
     * this  function does agregated search across specified categories returning the right set 
     * of data  updates will include adding viewType to ensure that  display method can 
     * handle the underlying dataset and use the correct view  display
     * 
     */
    search: function(req, res) {
        var query = req.query.query
            // change to waterfall 
            // find person then project then persons

        async.waterfall([
                function(callback) {
                    var searchResult = {}
                    setTimeout(function() {
                        sails.controllers.search.searchPerson(query, function(err, person) {
                            if (err) {
                                callback(err);
                            }
                            if (person) {
                                searchResult.person = person;
                            } else {
                                person = [];
                            }
                            searchResult.person = person
                            callback(null, searchResult)

                        })
                    }, 100)
                },

                function(searchresult, callback) {
                    var searchResult = searchresult;
                    searchResult.project = [];
                    setTimeout(function() {
                        sails.controllers.search.searchProject(query, function(err, projects) {
                            if (err) {
                                callback(err);
                            }


                            projects.forEach(function(project) {
                                    var foundPerson = _.find(searchResult.person, { _id: project.person.id })
                                    if (!foundPerson) {
                                        project.person.dataType = 'person';
                                        searchResult.person.push(project.person);
                                    }
                                })
                                // _.find(searchResult.person , function())
                            searchResult.project = projects
                            callback(null, searchResult)

                        })
                    }, 100)
                },
                function(searchresult, callback) {
                    var searchResult = searchresult;

                    if (searchResult.person.length && !searchResult.project.length) {
                        console.log('there is person but no project')
                    }
                    callback(null, searchResult);
                }
            ], function(err, results) {
                if (err) {
                  
                    return ResponseService.json(400, res, "Error Retrieving search results")
                }
                console.log(results)
                  var uniqResult ={

                    }
                    uniqResult.person = _.uniq(results.person , function(person){
                        return person._id
                    })
                    uniqResult.project = _.uniq(results.project,function(project){
                        return project._id
                    })
                return ResponseService.json(200, res, " Search Results Retrieved Successfully", uniqResult);
            })
            // async.parallel({
            //     person: function(callback) {
            //         setTimeout(function() {
            //             sails.controllers.search.searchPerson(query, function(err, result) {
            //                 if (err) {
            //                     callback(err);
            //                 }
            //                 callback(null, result)

        //             })
        //         }, 100)
        //     },
        //     project: function(callback) {
        //         setTimeout(function() {
        //             sails.controllers.search.searchProject(query, function(err, result) {
        //                 if (err) {
        //                     callback(err);
        //                 }
        //                 callback(null, result)

        //             })
        //         }, 100)
        //     }
        // }, function(err, results) {
        //     if (err) {
        //         return ResponseService.json(400, res, "Error Retrieving search results")
        //     }
        //     return ResponseService.json(200, res, " Search Results Retrieved Successfully", results);
        // })

    },

    searchPerson: function(query, cb) {
        var searchResult = [];
        Person.native(function(err, collection) {
            if (err) {
                console.log(err)
            }
            collection.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } }).toArray(function(err, persons) {
                    if (err) {
                        console.log(err)

                        console.log('err finding person')
                        cb(err)
                        return ResponseService.json(200, res, "Persons not found ", searchResult)

                    }
                    persons.forEach(function(person) {
                        person.dataType = 'person';
                        searchResult.push(person)
                    })
                    cb(null, searchResult)
                })
        })
    },
    searchProjectByPerson: function(query, cb) {
        var searchResult = [];

        Project.native(function(err, collection) {
            if (err) {
                console.log(err)
            }
            collection.find({ personId: {$in: query} }).toArray(function(err, project) {
                if (err) {
                    console.log(err)
                }
                project.forEach(function(project) {
                    project.dataType = 'person';
                    searchResult.pusch(project)
                })
                cb(null, searchResult)
            })
        })
    },
    searchProject: function(query, cb) {
        var searchResult = [];
        Project.native(function(err, collection) {
            if (err) {
                console.log(err)
            }
            collection.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } }).toArray(function(err, projects) {
                    if (err) {
                        console.log(err)

                        console.log('err finding project')
                        cb(err)
                        return ResponseService.json(200, res, "Project not found ", searchResult)

                    }
                    projects.forEach(function(project) {
                        project.dataType = 'project';
                        searchResult.push(project)
                    })
                    cb(null, searchResult)
                })
        })
    },
    searchDistrict: function(query) {

    },
    searchConstituency: function(query) {

    },



};
