/**
 * SearchController
 *
 * @description :: Server-side logic for managing Search
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
var pager = require('sails-pager');
var google = require('googleapis');
var KG_API_KEY  = 'AIzaSyCkaLpGSWMwYYBRPA3Gcl0UHnfFX-ItetQ';
var kgsearch = google.kgsearch('v1');
var kgSearchPromise = Promise.promisify(kgsearch.entities.search);

module.exports = {

    /**
     * @apiDefine SearchSuccessResponseData
     * @apiSuccess {Object} response variable holding response data
     * @apiSuccess {String} response.message response message
     * @apiSuccess {Object} response.data variable holding actual data
     */
    
    /**
     * @apiDefine  SearchHeader
     * @apiHeader {String} Authorization Basic authorization header token
     */

  /**
     * @api {post} /search Search Person or Project
     * @apiName Search Person or Project
     * @apiGroup Search
     * @apiVersion 0.0.1
     *
     *   @apiUse SearchHeader
     * 
     *
     * @apiParam {String} name  doctor name
     * @apiParam {String} address Doctor address
     * @apiParam {String} [specialization] Doctor Specialization
     * @apiParam {String} telephone Doctor Telephone Number
     * @apiParam {String} email Doctor Email Address
     * @apiParam {String} picture Doctor avatar
     *
     * @apiUse SearchSuccessResponseData
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *     "response": {
     *     "message": "Course created successfully",
     *     "data": {
     *         "school": "56ac782720d141560b2bf08f",
     *         "faculty": "56ac8a42aad4b35e0e091e13",
     *         "name": "Quantum Physics",
     *         "coursecode": "PHY301",
     *         "description": "Quantum Physics",
     *         "discipline": "56ac9df6d984e2aa11863212",
     *         "unit": 4,
     *         "active": true,
     *         "isDeleted": false,
     *         "createdAt": "2016-01-30T11:18:30.284Z",
     *         "updatedAt": "2016-01-30T11:18:30.284Z",
     *         "id": "56ac9c0677783639110e5470
     *         }
     *      }
     *   }
     *
     *
     * @apiErrorExample Error-Response
     * HTTP/1.1 400 Bad Request
     * {
     * "response": {
     * "message": "Validation error has occured",
     * "errors": {
     * "school": [
     * {
     *     "rule": "required",
     *     "message": "School is required"
     *  }
     *  ],
     *  "faculty": [
     *   {
     *      "rule": "required",
     *      "message": "Faculty is required"
     *      }
     *    ],
     *  "name": [
     *  {
     *    "rule": "string",
     *    "message": "`undefined` should be a string (instead of \"null\", which is a object)"
     *    },
     *    {
     *    "rule": "required",
     *    "message": "Name is required"
     *    }
     *    ],
     *    "unit": [
     *    {
     *    "rule": "integer",
     *    "message": "`undefined` should be a integer (instead of \"null\", which is a object)"
     *    },
     *    {
     *    "rule": "required",
     *    "message": "Unit is required"
     *    }
     *    ]
     *    }
     *    }
     *    }
     * @apiErrorExample Error-Response
     * HTTP/1.1 400 Bad Request
     * {
     * "response": {
     * "message": "Cannot Create Existing Course",
     *    }
     *    }
     *    
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     */
    search: function(req, res) {
        var query = req.query.query
            async.waterfall(
            [
                function(callback) {
                    var searchResult = {}
                    setTimeout(function() {
                        sails.controllers.search.searchPerson(query, function(err, persons) {
                            if (err) {
                                callback(err);
                            }

                            persons.forEach(function(person){

                                if(person._id){
                                    person.id = person._id
                                }
                            })
                             searchResult.person = persons
                            callback(null, searchResult)

                        })
                    }, 100)
                },
                 function(searchresult,callback) {
                    var searchResult =searchresult
                    var personIds = searchResult.person.map(function(person){
                        return person._id;
                    })


                    setTimeout(function() {
                        Person.find({ _id : {$in : personIds} }).populate('projects').exec(function(err, persons){
                            if(err){
                                callback(err)
                            }
                                persons.forEach(function(person){

                                    var totalBudget = 0;
                                if(person._id){
                                    person.id = person._id
                                }
                                if(person.projects.length) {
                                    person.projects.forEach(function(project){
                                        project.description = project.description.toLowerCase();
                                        totalBudget = totalBudget + parseFloat(project.cost);
                                    })
                                }
                                person.name = person.name.toLowerCase();
                                person.totalBudget = totalBudget;
                            })

                            console.log(persons);
                            searchResult.person = persons
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
                                    if (project._id) {
                                        project.id = project._id;
                                    }
                                    project.description = project.description.toLowerCase();
                                    var foundPerson = _.find(searchResult.person, { _id: project.person.id })
                                    if (!foundPerson) {
                                        project.person.dataType = 'person';
                                        if (project.person._id) {
                                            project.person.id = project.person._id;

                                        }
                                        project.person.name = project.person.name.toLowerCase();
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
                var uniqResult = {

                }
                uniqResult.person = _.uniq(results.person, function(person) {
                    return person.id
                })
                uniqResult.project = _.uniq(results.project, function(project) {
                    return project.id
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
     searchGraphByPerson: function(query, cb) {
        var searchResult = [];

        Project.native(function(err, collection) {
            if (err) {
                console.log(err)
            }
            collection.find({ personId: { $in: query } }).toArray(function(err, project) {
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
    searchProjectByPerson: function(query, cb) {
        var searchResult = [];

        Project.native(function(err, collection) {
            if (err) {
                console.log(err)
            }
            collection.find({ personId: { $in: query } }).toArray(function(err, project) {
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

    matchProject: function(req,res) {
        var payload = request.body; 

        if(!payload.project) {
            return  ResponseService.json(400, res, "Project not set");

        }

        if(!payload.person) {
            return ResponseService.json(400, res, "Person not Set");
        }  
        if(!payload.category) {
            return ResponseService.json(400, res, "Category not Set");
        }

        Project.findOne(project).then(function(project) {

            if(!project) {
                return ResponseService.json(404 , res, "Project Not Found" ) ;
            }
            personLink  = person.findOne(person);
            return [project, person];
        }).spread(function(project, person) {
            if(!person) {
                return ResponseService.json(404 , res, "Person not Found");
            }
            data = {
               personId : person.id,
               district : person.district,
               districtId : person.districtId,
               state : person.state,
               stateId : person.stateId,
               category  : payload.category ,
               matched : true
            }
            var projectUpdate = Project.Update({ id: project.id,
                isDeleted: false}, data); 

            return projectUpdate;
         
        }).then(function(updated) {

            if (!updated.length) {
                    return ResponseService.json(404, res, "Project not found");
                }
                return ResponseService.json(200, res, "Project updated successfully", updated[0]);
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    },     
    homeSearch : function(req,res) {
        /*
         * this function handles search on the front page
         */
        async.waterfall([
             function(callback) {
                    var searchResult = {}
                    setTimeout(function() {
                       Person.native(function(err, collection){
                        if(err){
                            callback(err)
                        }
                        collection.aggregate( { $sample: { size: 3 } } ).toArray(function(err,persons){
                            if(err){

                                callback(err)
                            }
                            persons.forEach(function(person){
                                if(person._id){
                                    person.id = person._id;
                                }
                            })
                            searchResult.person = persons;
                            callback(null, searchResult);
                        })
                       })

                    }, 100)
                },
                 function(searchresult,callback) {

                    var searchResult = searchresult
                    setTimeout(function() {
                        Project.native(function(err,collection){
                            if(err){
                                callback(err)
                            }
                            collection.aggregate( { $sample: { size: 3 } } ).toArray(function(err,projects){
                                if(err){
                                    callback(err);
                                }
                                projects.forEach(function(project){
                                    if(project._id){
                                        project.id = project._id;
                                    }

                                })
                                searchResult.project = projects;
                                callback(null, searchResult);
                            })
                        })
                    }, 100)
                },
            ] , function(err, result){
             if (err) {

                    return ResponseService.json(400, res, "Error Retrieving search results")
                }
                
                return ResponseService.json(200, res, " Search Results Retrieved Successfully", result);

        })
        
    }



};
