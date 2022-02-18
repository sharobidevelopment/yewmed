/**
 * 
 */

'use strict';
angular.module('myApp').factory('ContactService', ['$http', '$q','$cookies', function($http, $q,$cookies){

  
    var REST_CONTACTS_SERVICE_URI = serverurl+'/contact/saveContacts';
    var factory = {
	        createContactus: createContactus
    };
    return factory;




       function createContactus(contact) {
	        var deferred = $q.defer();
	        $http.post(REST_CONTACTS_SERVICE_URI, contact)
	            .then(
	            function (response) {
	                deferred.resolve(response.data);
	            },
	            function(errResponse){
	                //console.error('Error while creating contact message');
	                deferred.reject(errResponse);
	            }
	        );
	        return deferred.promise;
	    }


	   //  function createContactus(contact) {
   
    //     var deferred = $q.defer();
     
    //     $http({
    //         method: 'POST',
    //         url: REST_CONTACTS_SERVICE_URI,
    //         data: contact
    //     }).then(function(response) {
    //             deferred.resolve(response);
    //         },function(error){
    //             console.log(error);
    //             deferred.reject(error);
    //         })
    //     return deferred.promise;
    // }


}]);
