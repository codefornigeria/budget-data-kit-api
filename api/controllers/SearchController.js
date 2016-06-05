/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /*
     * this  function does agregated search across specified categories returning the right set 
     * of data  updates will include adding viewType to ensure that  display method can 
     * handle the underlying dataset and use the correct view  display
     * 
     */
    search: function(req, res) {

        var query = req.query.query
        console.log('query value');
        console.log(query)
        var searchResult = [];
        /*
        preprocess query 
         */

        /*
        search the  qualified model based on returned preprocessed query
         */
        //search person 
        Person.native(function(err,collection){
            if(err){
                console.log(err)
            }
            collection.find({$text: {$search: query}}, { score: { $meta: "textScore" } })
           .sort( { score: { $meta: "textScore" } } ).toArray(function(err , persons){
                if(err){
                    console.log(err)
                    console.log('err finding person')
           return ResponseService.json(200,res , "Persons not found " , searchResult)
   
                }
              persons.forEach(function(person) {
                        person.dataType = 'person';
                        searchResult.push(person)
                    })

              return ResponseService.json(200,res , "Persons retrieved successfully" , searchResult)
            })
        })
        // Person.find({ $text: { 'search': "bukola" } }).then(function(person) {

        //         var projectQry = Project.find({$text: {'search': "bukola"}});

        //         return [person, projectQry];
        //     }).spread(function(persons, projects) {
        //         if (persons.length) {
        //             persons.forEach(function(person) {
        //                 person.dataType = 'person';
        //                 searchResult.push(person)
        //             })
        //         }
        //         if (projects.length) {
        //             projects.forEach(function(project) {
        //                 project.dataType = 'project'
        //                 searchResult.push(project)
        //             })
        //         }
        //         if (searchResult.length) {
        //             return ResponseService.json(200, res, "Data Retrieved successfully", searchResult)
        //         }
        //         return ResponseService.json(200, res, "Data not Found", searchResult);
        //     }).catch(function(err) {
        //         ValidationService.jsonResolveError(err, res)
        //     })
            /*
            return an array of result
             */
            /*
            create 
             */
    }
};
