/**
 * 
 */

'use strict';
angular.module('myApp').factory('CommonService', ['$http', '$q','$cookies', function($http, $q,$cookies){
     var REST_GET_COUNTRY_SERVICE_URI = serverurl+'/addresses/countries';
     var REST_GET_STATES_SERVICE_URI = serverurl+'/addresses/states';    
   

    var factory = {
    	getCountryList: getCountryList,
        getStateList:getStateList,
        getCityList:getCityList
        
    };
    return factory;


    function getCountryList() {
        var deferred = $q.defer();
        $http.get(REST_GET_COUNTRY_SERVICE_URI)
            .then(
            function (response) {
            	deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

   function getStateList(countryid) {
        var deferred = $q.defer();
        $http.get(REST_GET_COUNTRY_SERVICE_URI+"/"+countryid+"/states")
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
     function getCityList(stateid) {
        var deferred = $q.defer();
        $http.get(REST_GET_STATES_SERVICE_URI+"/"+stateid+"/cities")
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }

   
}]);
