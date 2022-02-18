/**
 * 
 */

'use strict';
angular.module('myApp').factory('LoginService', ['$http', '$q','$cookies', function($http, $q,$cookies){
    
  


    var REST_LOGIN_SERVICE_URI = serverurl+'/users/login';
    var REST_CATEGORIES_MENU_SERVICE_URI = serverurl+'/categories/tree';
    var REST_CALL_CART_SERVICE_URI = serverurl+'/cart';
    var REST_GROUPS_MENU_SERVICE_URI = serverurl+'/groups';
    var REST_REGISTER_SERVICE_URI = serverurl+'/users';
	var factory = {
    	loginRequest: loginRequest,
        categoriesMenuRequest: categoriesMenuRequest,
        groupsMenuRequest: groupsMenuRequest,
        callCartData:callCartData,
        userRequest:userRequest
    };
    return factory;

    

    function loginRequest(user) {
      //alert('loginRequest' + JSON.stringify(user));
        var deferred = $q.defer();
        // user.loginType='USER';
        $http.post(REST_LOGIN_SERVICE_URI, user)
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
    
    
    function categoriesMenuRequest() {
        var deferred = $q.defer();
        $http.get(REST_CATEGORIES_MENU_SERVICE_URI)
            .then(
            function (response) {
            	deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while categoriesMenu fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }


    function callCartData(){
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
            $http.get(REST_CALL_CART_SERVICE_URI,{        
                            headers:{'Authorization': tokenCookie}
                  })
                .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    //console.error('Error while creating User');
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;

    }



   function groupsMenuRequest() {
        var deferred = $q.defer();
        $http.get(REST_GROUPS_MENU_SERVICE_URI)
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while groupsMenuRequest fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }


    function userRequest(register) {
      //alert("userRequest::"+self.register);
        var deferred = $q.defer();
        /*$http.post(REST_REGISTER_SERVICE_URI, register)
            .then(
            function (response,headers) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('Error while creating User');
                deferred.reject(errResponse);
            }
        );*/
        $http({
            method: 'POST',
            url: REST_REGISTER_SERVICE_URI,
            data: register
        }).then(function(response) {
                deferred.resolve(response);
            },function(error){
                //console.log(error);
                deferred.reject(error);
            })
        return deferred.promise;
    }



}]);
