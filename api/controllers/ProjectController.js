/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');
module.exports = {
    /**
     * @apiDefine ProjectSuccessResponseData
     * @apiSuccess {Object} response variable holding response data
     * @apiSuccess {String} response.message response message
     * @apiSuccess {Object} response.data variable holding actual data
     */
    
    /**
     * @apiDefine  ProjectHeader
     * @apiHeader {String} Authorization Basic authorization header token
     */


    /**
     * @api {post} /project Create Project
     * @apiName Create Project
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     *   @apiUse ProjectHeader
     * 
     *
     * @apiParam {String} name  doctor name
     * @apiParam {String} address Doctor address
     * @apiParam {String} [specialization] Doctor Specialization
     * @apiParam {String} telephone Doctor Telephone Number
     * @apiParam {String} email Doctor Email Address
     * @apiParam {String} picture Doctor avatar
     *
     * @apiUse ProjectSuccessResponseData
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
    
        Project.create(data).then(function(project){
            return ResponseService.json(200,res,"Project Created Successfully");
        }).catch(function(err){
            return ValidationService.jsonResolveError(err,res);
        })

    },

    

    /**
     * @api {post} /projects Batch Create Projects
     * @apiName Batch Create Projects
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     *   @apiUse ProjectHeader
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
     * @apiUse ProjectSuccessResponseData
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     * "response": {
     * "message": "Projects created successfully",
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


         var projects = req.body.projects;
   
        var promiseArray = [];
        for (var i = 0, len = projects.length; i < len; i++) {
         
            try {
                promiseArray.push(Project.create(projects[i]));
            } catch (e) {
                return ResponseService.json(500, res, "Internal Error: Please check inputs");
            }
        }
        Promise.all(promiseArray).then(function(projects) {
            return ResponseService.json(200, res, "Doctors created successfully", projects);
        });


    },
    
    /**
     * @api {get} /project List Projects
     * @apiName List  Projects
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     *
     *  @apiUse ProjectHeader
     *  
     * @apiUse ProjectSuccessResponseData
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


        Project.count(criteria).then(function(count) {
            var findQuery = Project.find(criteria).populateAll()
                .sort('createdAt DESC')
                .paginate(pagination);
            return [count, findQuery]

        }).spread(function(count, projects) {

            if (projects.length) {
                projects.forEach(function(project){
                project.description = project.description.toLowerCase();
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
                return ResponseService.json(200, res, " Projects retrieved successfully", projects, meta);
            } else {
                return ResponseService.json(200, res,"Projects not found", [])
            }
        }).catch(function(err) {
            return ValidationService.jsonResolveError(err, res);
        });
    },

  /**
     * @api {get} /project/:id View Project
     * @apiName View  Project
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     * @apiUse ProjectHeader
     *
     * @apiParam {String} id PRoject id
     * @apiUse ProjectSuccessResponseData
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: "Project retrieved successfully",
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

        Project.findOne(criteria).then(function(project) {
                if (!project) {
                    return ResponseService.json(404, res, "Project not found");
                }
                return ResponseService.json(200, res, "Project retrieved successfully", project);
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    },

    
    /**
     * @api {put} /related-project/:id Retrieve Related Project 
     * @apiName Retrieve Related Project
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     *  @apiUse ProjectHeader
     * 
     * @apiUse ProjectSuccessResponseData
     *
     * 
    * @apiParam {Integer} if  project id
     *
     * @apiSuccessExample Success-Response
     * HTTP/1.1 200 OK
     * {
     *    response: {
     *        message: " Related Projects Found",
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
    getRelatedProject: function(req , res) { 
        // get current project
        // using current project values 
        // get other project that fits into that same region system 
        
        Project.findOne(req.params.id).then( function(project) {
            if(!project) {
                return  ResponseService.json(200, res , "Project not Found");
            }
            relatedProjects = Project.find(criteria).limit(10);
            return  [project, relatedProjects]
        }).spread(function(project, relatedProjects) {
            if(!relatedProjects.length) { 
                return ResponseService.json(200, res, "Related Project not found", []);
            }

            return ResponseService.json(200, res , "Related Projects found", relatedProjects);
        }).catch(function(err){
            return ValidationService.jsonResolveError(err,res); 
        })
    },
    /**
     * @api {put} /project/:id Update Project
     * @apiName Update Project
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     *  @apiUse ProjectHeader
     * 
     * @apiUse ProjectSuccessResponseData
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

        Project.update({
                id: req.params.id,
                isDeleted: false
            }, data).then(function(updated) {
                if (!updated.length) {
                    return ResponseService.json(404, res, "Project not found");
                }
                return ResponseService.json(200, res, "Project updated successfully", updated[0]);
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    },

    batchUpdate: function(req, res) {
        var projects = req.body.projects;


        var promiseArray = [];
        for (var i = 0, len = projects.length; i < len; i++) {
            if (!projects[i].id) {
                continue;
            }

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
    },


    /**
     * @api {delete} /project/:id Delete Doctor
     * @apiName Delete Project
     * @apiGroup Project
     * @apiVersion 0.0.1
     *
     *  @apiUse ProjectHeader
     *
     * @apiUse ProjectSuccessResponseData
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
        Project.update({
                id: req.params.id,
            }, {
                isDeleted: true
            }).then(function(deleted) {
                if (!deleted.length) {
                    return ResponseService.json(404, res, "Project not found");
                }
                return ResponseService.json(200, res, "Project deleted successfully");
            })
            .catch(function(err) {
                return ValidationService.jsonResolveError(err, res);
            });
    }

};
