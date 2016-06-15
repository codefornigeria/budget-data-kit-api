/**
 * PersonController
 *
 * @description :: Server-side logic for managing People
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
module.exports = {
    /**
     * @apiDefine DoctorSuccessResponseData
     * @apiSuccess {Object} response variable holding response data
     * @apiSuccess {String} response.message response message
     * @apiSuccess {Object} response.data variable holding actual data
     */
    
    /**
     * @apiDefine  DoctorHeader
     * @apiHeader {String} Authorization Basic authorization header token
     */


    /**
     * @api {post} /doctor Create Doctor
     * @apiName Create Doctor
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     *   @apiUse DoctorHeader
     * 
     *
     * @apiParam {String} name  doctor name
     * @apiParam {String} address Doctor address
     * @apiParam {String} [specialization] Doctor Specialization
     * @apiParam {String} telephone Doctor Telephone Number
     * @apiParam {String} email Doctor Email Address
     * @apiParam {String} picture Doctor avatar
     *
     * @apiUse DoctorSuccessResponseData
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
    var verifyPayload =  {
        name : data.name ,
        isDeleted : false
     }   

    Doctor.validateDoctor(verifyPayload).then(function(doctor){
            var existingDoctor = false
             var DoctorCreateQry =false
             if(doctor) {
                existingDoctor = true
                DoctorCreateQry = doctor
             }
            if(!doctor) {
             DoctorCreateQry = Doctor.create(data);
            }
            return [existingDoctor,DoctorCreateQry];
        }).spread(function(existingDoctor,doctor) {
            if(existingDoctor){
                       return ResponseService.json(200, res, "Doctor already exists", doctor);
            }
            if (doctor) {
                return ResponseService.json(200, res, "Doctor created successfully", doctor);
            }

        }).catch(function(err) {
            return ValidationService.jsonResolveError(err, res);
        });

    },

    

    /**
     * @api {post} /doctors Batch Create Doctor
     * @apiName Batch Create Doctor
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     *   @apiUse DoctorHeader
     * @apiParam {Array}  doctors   Doctors Object Array
     * @apiParam {String} name  doctor name
     * @apiParam {String} address Doctor address
     * @apiParam {String} [specialization] Doctor Specialization
     * @apiParam {String} telephone Doctor Telephone Number
     * @apiParam {String} email Doctor Email Address
     * @apiParam {String} picture Doctor avatar
     *
      
     *
 \    *
     * @apiUse DoctorSuccessResponseData
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     * "response": {
     * "message": "Courses created successfully",
     * "data": [{
     *     "school": "56ac782720d141560b2bf08f",
     *     "faculty": "56ac8a42aad4b35e0e091e13",
     *     "name": "Quantum Physics",
     *     "coursecode": "PHY301",
     *     "description": "Quantum Physics",
     *     "discipline": "56ac9df6d984e2aa11863212",
     *     "unit": 4,
     *     "active": true,
     *     "isDeleted": false,
     *     "createdAt": "2016-01-30T11:18:30.284Z",
     *     "updatedAt": "2016-01-30T11:18:30.284Z",
     *     "id": "56ac9c0677783639110e5470
     * },
     * {
     *     "school": "56ac782720d141560b2bf08f",
     *     "faculty": "56ac8a42aad4b35e0e091e13",
     *     "name": "Quantum Physics",
     *     "coursecode": "PHY301",
     *     "description": "Quantum Physics",
     *     "discipline": "56ac9df6d984e2aa11863212",
     *     "unit": 4,
     *     "active": true,
     *     "isDeleted": false,
     *     "createdAt": "2016-01-30T11:18:30.284Z",
     *     "updatedAt": "2016-01-30T11:18:30.284Z",
     *     "id": "56ac9c0677456639110e5470
     * }]
     * }
     * }
     * @apiErrorExample Error-Response
     * HTTP/1.1 400 Bad Request
     * {
     *    response: {
     *        message: "Course name is required"
     *    }
     * } 
     * 
     *  @apiErrorExample Error-Response
     * HTTP/1.1 500 Internal Server Error
     * {
     *    response: {
     *        message: "Internal Error: Please check inputs"
     *    }
     * }
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     * @apiError (Error 500) {Object} response variable holding response data
     * @apiError (Error 500) {String} response.message response message
     */
    batchCreate: function(req, res) {


         var doctors = req.body.doctors;
   
        var promiseArray = [];
        for (var i = 0, len = doctors.length; i < len; i++) {
         
            try {
                promiseArray.push(Doctor.create(doctors[i]));
            } catch (e) {
                return ResponseService.json(500, res, "Internal Error: Please check inputs");
            }
        }
        Promise.all(promiseArray).then(function(doctors) {
            return ResponseService.json(200, res, "Doctors created successfully", doctors);
        });


    },
    
    /**
     * @api {get} /doctor List Doctors
     * @apiName List  Doctors
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     *
     *  @apiUse DoctorHeader
     *  
     * @apiUse DoctorSuccessResponseData
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


        Person.count(criteria).then(function(count) {
            var findQuery = Person.find(criteria).populateAll()
                .sort('createdAt DESC')
                .paginate(pagination);
            return [count, findQuery]

        }).spread(function(count, persons) {

            if (persons.length) {

                persons.forEach(function(person){
                    var totalBudget=0;
                     if(person.projects.length) {
                                    person.projects.forEach(function(project){
                                        totalBudget = totalBudget + parseFloat(project.cost);
                                    })
                                }
                                person.totalBudget = totalBudget;
                })
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
     * @api {get} /doctor/search Search Doctors
     * @apiName Search  Doctors
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     *
     *  @apiUse DoctorHeader
     *  
     * @apiUse DoctorSuccessResponseData
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
    search: function(req, res) {
        var pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.perPage) || 10
        };

        var criteria = {
            isDeleted: false
        };

        if (req.query.name) {
            criteria.name ={
                'startsWith': req.query.name
            }; // change this to starts with  or endswith
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

        Doctor.count(criteria).then(function(count) {
            var findQuery = Doctor.find(criteria).populateAll()
                .sort('createdAt DESC')
                .paginate(pagination);
            return [count, findQuery]

        }).spread(function(count, doctors) {
            if (doctors.length) {
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
                return ResponseService.json(200, res, " Doctors retrieved successfully", doctors, meta);
            } else {
                return ResponseService.json(200, res,"Doctors not found", [])
            }
        }).catch(function(err) {
            return ValidationService.jsonResolveError(err, res);
        });
    },
    /**
     * @api {get} /doctor/:id View Doctor
     * @apiName View  Doctor
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     * @apiUse DoctorHeader
     *
     * @apiParam {String} id Doctor id
     * @apiUse DoctorSuccessResponseData
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Doctor retrieved successfully",
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
     *        message: "Doctor not found"
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
        var totalProjectValue = 0
        Person.findOne(criteria).populate('projects').then(function(person) {
                if (!person) {
                    return ResponseService.json(404, res, "Person not found");
                }
                person.totalProjectValue = 0;
                if(person.projects.length){
                    person.projects.map(function(project){

                    this.totalProjectValue =  this.totalProjectValue + parseFloat(project.cost);
                    } , person)
                }

                console.log(person);
                return ResponseService.json(200, res, "Person retrieved successfully", person);
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    },

    /**
     * @api {put} /doctor/:id Update doctor
     * @apiName Update Doctor
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     *  @apiUse DoctorHeader
     * 
     * @apiUse DoctorSuccessResponseData
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

        Doctor.update({
                id: req.params.id,
                isDeleted: false
            }, data).then(function(updated) {
                if (!updated.length) {
                    return ResponseService.json(404, res, "Doctor not found");
                }
                return ResponseService.json(200, res, "Doctor updated successfully", updated[0]);
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    },

    batchUpdate: function(req, res) {
        var doctors = req.body.doctors;


        var promiseArray = [];
        for (var i = 0, len = doctors.length; i < len; i++) {
            if (!doctors[i].id) {
                continue;
            }

            try {
                promiseArray.push(Doctor.update({
                    id: doctors[i].id
                }, doctors[i]));
            } catch (e) {
                return ResponseService.json(500, res, "Internal Error: Please check inputs");
            }
        }
        Promise.all(promiseArray).then(function(doctors) {
            return ResponseService.json(200, res, "Doctors updated successfully", doctors);
        });
    },


    /**
     * @api {delete} /doctor/:id Delete Doctor
     * @apiName Delete Doctor
     * @apiGroup Doctor
     * @apiVersion 0.0.1
     *
     *  @apiUse DoctorHeader
     *
     * @apiUse DoctorSuccessResponseData
     *
     *   @apiParam {String} Doctor id
     * 
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Doctor deleted successfully",
     * }
     *
     *
     * @apiErrorExample Error-Response
     * HTTP/1.1 404 Not Found
     * {
     *    response: {
     *        message: "Doctor not found"
     *    }
     * }
     *
     * @apiError (Error 400) {Object} response variable holding response data
     * @apiError (Error 400) {String} response.message response message
     */
    delete: function(req, res) {
        Doctor.update({
                id: req.params.id,
            }, {
                isDeleted: true
            }).then(function(deleted) {
                if (!deleted.length) {
                    return ResponseService.json(404, res, "Doctor not found");
                }
                return ResponseService.json(200, res, "Doctor deleted successfully");
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    }

};

