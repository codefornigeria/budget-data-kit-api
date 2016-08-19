/**
 * PersonController
 *
 * @description :: Server-side logic for managing People
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
var google = require('googleapis');
var KG_API_KEY  = 'AIzaSyCkaLpGSWMwYYBRPA3Gcl0UHnfFX-ItetQ';
var kgsearch = google.kgsearch('v1');
var kgSearchPromise = Promise.promisify(kgsearch.entities.search);
var jsonld = require('jsonld');

module.exports = {
    /**
     * @apiDefine PersonSuccessResponseData
     * @apiSuccess {Object} response variable holding response data
     * @apiSuccess {String} response.message response message
     * @apiSuccess {Object} response.data variable holding actual data
     */
    
    /**
     * @apiDefine  PersonHeader
     * @apiHeader {String} Authorization Basic authorization header token
     */

  /**
     * @api {post} /person Create Person
     * @apiName Create Person
     * @apiGroup Person
     * @apiVersion 0.0.1
     *
     *   @apiUse PersonHeader
     * 
     *
     * @apiParam {String} name  doctor name
     * @apiParam {String} address Doctor address
     * @apiParam {String} [specialization] Doctor Specialization
     * @apiParam {String} telephone Doctor Telephone Number
     * @apiParam {String} email Doctor Email Address
     * @apiParam {String} picture Doctor avatar
     *
     * @apiUse PersonSuccessResponseData
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
    create: function(req, res) {
        var data = req.body;
   
        Person.create(data).then(function(person){
            return ResponseService.json(200, res, " Person created successfully" , person);
        }).catch(function(err){
            return ValidationService.jsonResolveError(err,res);
        })
    
    },

    

   
    /**
     * @api {get} /person List Person
     * @apiName List  Person
     * @apiGroup Person
     * @apiVersion 0.0.1
     *
     *
     * @apiUse PersonHeader
     *  
     * @apiUse PersonSuccessResponseData
     *
     * 
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Doctors retrieved successfully",
     *        data: [
     *       {
     *              school: "35467irefc4t5",
     *              faculty: "dgbfdt35466736554",
     *              name: "engineering mathematics",
     *              shortName: " MTH 101",
     *              active: true,
     *              unit: 4,
     *              description: "Engineering mathematics description",
     *              createdAt: "2015-12-04T14:12:49.328Z",
     *              updatedAt: "2015-12-04T14:12:49.328Z",
     *              id: "56619f611d2b4c0170107d22"
     *            },
     *            {
     *              school: "35467irefc4t5",
     *              faculty: "dgbfdt35466736554",
     *              name: "engineering mathematics",
     *              shortName: " MTH 101",
     *              active: true,
     *              unit: 4,
     *              description: "Engineering mathematics description",
     *              createdAt: "2015-12-04T14:12:49.328Z",
     *              updatedAt: "2015-12-04T14:12:49.328Z",
     *              id: "56619f611d2b4c0170107d22"
     *            }
     *       ]
     *    }
     * }
     *
     *
     * @apiErrorExample Error-Response
     * HTTP/1.1 404 Not Found
     * {
     *    response: {
     *        message: "Courses not found",
     *        data : []
     *    }
     * }
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     */
    

    list: function(req, res) {
        var pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.perPage) || 10
        };
        var limit = 50;
        var criteria = {
            isDeleted: false
        };

        if (req.query.name) {
            criteria.name = req.query.name; // change this to starts with  or endswith
        }

        if (req.query.specialization) {
            criteria.specialization = req.query.specialization;
        }


        if (req.query.email) {
            criteria.email = req.query.email;
        }

        if (req.query.telephone) {
            criteria.telephone = req.query.telephone;
            }

        if (req.query.limit) {
            limit = req.query.limit;
            criteria.limit = limit;
        }

        Person.count(criteria).then(function(count) {
            var findQuery = Person.find(criteria) .limit(1)
               .populateAll()
                .sort('createdAt DESC')
                .paginate(pagination);
            return [count, findQuery]

        }).spread(function(count, persons) {
            if (persons.length) {
                var numberOfPages = Math.ceil(count / pagination.limit)
                var nextPage = parseInt(pagination.page) + 1;
                var meta = {
                    page: pagination.page,
                    perPage: pagination.limit,
                    previousPage: (pagination.page > 1) ? parseInt(pagination.page) - 1 : false,
                    nextPage: (numberOfPages >= nextPage) ? nextPage : false,
                    pageCount: numberOfPages,
                    total: count
                }
                return ResponseService.json(200, res, " Persons retrieved successfully", persons, meta);
            } else {
                return ResponseService.json(200, res,"Persons not found", [])
            }
        }).catch(function(err) {
            return ValidationService.jsonResolveError(err, res);
        });
    },

    
    /**
     * @api {get} /person/:id View Person
     * @apiName View  Person
     * @apiGroup Person
     * @apiVersion 0.0.1
     *
     * @apiUse PersonHeader
     *
     * @apiParam {String} id Doctor id
     * @apiUse PersonSuccessResponseData
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Person retrieved successfully",
     *        data: {
     *              school: "35467irefc4t5",
     *              faculty: "dgbfdt35466736554",
     *              name: "engineering mathematics",
     *              shortName: " MTH 101",
     *              active: true,
     *              unit: 4,
     *              description: "Engineering mathematics description",
     *              createdAt: "2015-12-04T14:12:49.328Z",
     *              updatedAt: "2015-12-04T14:12:49.328Z",
     *              id: "56619f611d2b4c0170107d22"
     *            }
     *    }
     * }
     *
     *
     * @apiErrorExample Error-Response
     * HTTP/1.1 404 Not Found
     * {
     *    response: {
     *        message: "Person not found"
     *    }
     * }
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     */
    

    view: function(req, res) {
        var criteria = {
            isDeleted: false,
            id: req.params.id
        }
        Person.findOne(criteria).populate('projects').then(function(person) {
                if (!person) {
                    return ResponseService.json(404, res, "Person not found");
                }
                personKgEntity = kgSearchPromise({key:KG_API_KEY, query: person.name});

                return [person , personKgEntity];

            }).spread(function(person, personEntity){
                    
                 
                    person.projects.map(function(project){
                        project.description = project.description.toLowerCase();
                        project.ministry =  project.ministry.toLowerCase();
                        project.district.name  = project.district.name.toLowerCase();
                    })
                    if(personEntity.itemListElement){

                    person.graphData =  personEntity.itemListElement[0].result
                    console.log(person.graphData);
                        
                }else {
                    person.graphData = null;
                }
                return ResponseService.json(200, res, "Person retrieved successfully", person);
         
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res );
            });
    },


    /**
     * @api {put} /person/:id Update Person
     * @apiName Update Doctor
     * @apiGroup Person
     * @apiVersion 0.0.1
     *
     *  @apiUse PersonHeader
     * 
     * @apiUse PersonSuccessResponseData
     *
     * 
    * @apiParam {Integer} school  school id
     * @apiParam {String} faculty Faculty id
     * @apiParam {String} [discipline] Discipline id
     * @apiParam {String} name course name 
     * @apiParam {String} [coursecode] course code 
     * @apiParam {String} [description] course description 
     * @apiParam {boolean} active  is active course?
     * @apiParam {String} unit Course unit 
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Course updated successfully",
     *        data: {}
     *    }
     * }
     *
     *
     * @apiErrorExample Error-Response
     * HTTP/1.1 404 Not Found
     * {
     *    response: {
     *        message: "Course not found"
     *    }
     * }
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     */
    

    update: function(req, res) {
        var data = req.body;

        if (data.isDeleted) {
            delete data.isDeleted;
        }

        Person.update({
                id: req.params.id,
                isDeleted: false
            }, data).then(function(updated) {
                if (!updated.length) {
                    return ResponseService.json(404, res, "Person not found");
                }
                return ResponseService.json(200, res, "Person updated successfully", updated[0]);
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    },

   
    /**
     * @api {delete} /perosn/:id Delete Person
     * @apiName Delete Person
     * @apiGroup Person
     * @apiVersion 0.0.1
     *
     *  @apiUse PersonHeader
     *
     * @apiUse PersonSuccessResponseData
     *
     *   @apiParam {String} Person id
     * 
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Person deleted successfully",
     * }
     *
     *
     * @apiErrorExample Error-Response
     * HTTP/1.1 404 Not Found
     * {
     *    response: {
     *        message: "Person not found"
     *    }
     * }
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     */
    

    delete: function(req, res) {
        Person.update({
                id: req.params.id,
            }, {
                isDeleted: true
            }).then(function(deleted) {
                if (!deleted.length) {
                    return ResponseService.json(404, res, "Person not found");
                }
                return ResponseService.json(200, res, "Person deleted successfully");
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    }

};

