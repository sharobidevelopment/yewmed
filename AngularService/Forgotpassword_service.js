/**
 * 
 */

'use strict';
angular.module('myApp').factory('ForgotpasswordService', ['$http', '$q','$cookies', function($http, $q,$cookies){

  
    var REST_FORGOTPASSWORD_SERVICE_URI = serverurl+'/Forgotpassword';
    var factory = {
	        createForgotpassword: createForgotpassword
    };
    return factory;




       function createForgotpassword(forgot) {
	        var deferred = $q.defer();
	        $http.post(REST_FORGOTPASSWORD_SERVICE_URI, forgot)
	            .then(
	            function (response) {
	                deferred.resolve(response.data);
	            },
	            function(errResponse){
	                //console.error('Error while changing password');
	                deferred.reject(errResponse);
	            }
	        );
	        return deferred.promise;
	    }
}]);
