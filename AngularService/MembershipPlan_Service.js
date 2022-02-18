/**
 * 
 */

'use strict';
angular.module('myApp').factory('MemberPlanService', ['$http', '$q','$cookies', function($http, $q,$cookies){
    
   
    var REST_MEMBERSHIP_GETPLANS_SERVICE_URI = serverurl+'/memberships/getAllActive';
    var REST_MEMBERSHIP_FEATURES_SERVICE_URI = serverurl+'/features/getAllActive';
     var factory = {
    	getAllMembershipPlans: getAllMembershipPlans,
        getAllFeatures:getAllFeatures
    };
    return factory;
 

   /* function getAllMembershipPlans() {
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.get(REST_MEMBERSHIP_PLANS_SERVICE_URI,{        
                            headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
            	deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function getAllFeatures(){
       var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.get(REST_MEMBERSHIP_FEATURES_SERVICE_URI,{        
                            headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;

    }*/
    
    
    function getAllMembershipPlans() {
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.get(REST_MEMBERSHIP_GETPLANS_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }
    
    function getAllFeatures(){
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.get(REST_MEMBERSHIP_FEATURES_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;

    }
   

}]);
