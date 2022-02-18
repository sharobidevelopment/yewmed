/**
 * 
 */

'use strict';
angular.module('myApp').factory('CartService', ['$http', '$q','$cookies', function($http, $q,$cookies){

    var REST_GET_CUSTOMER_ADDRESS_SERVICE_URI = serverurl+'/users/details';   

    var factory = {
    	callCustomerAddressData: callCustomerAddressData
        
    };
    return factory;


    function callCustomerAddressData() {
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.get(REST_GET_CUSTOMER_ADDRESS_SERVICE_URI,{        
                    headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
            	deferred.resolve(response.data);
            },
            function(errResponse){
                //console.error('Error while categoriesMenu fetch');
                deferred.reject(errResponse);
            }
        );
        return deferred.promise;
    }


   
}]);
