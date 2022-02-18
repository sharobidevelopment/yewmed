/**
 * 
 */

'use strict';
angular.module('myApp').factory('CheckoutService', ['$http', '$q','$cookies', function($http, $q,$cookies){

 var REST_CUSTOMER_CHECKOUT_SERVICE_URI = serverurl+'/orders';
 var REST_CUSTOMER_PAYTM_CHECKOUT_SERVICE_URI = serverurl+'/orders/pgRequest';
 var REST_CUSTOMER_FILEUPLOAD_SERVICE_URI=serverurl+'/prescriptions/upload';
 var REST_CUSTOMER_PAYMENT_OPTION_URI=serverurl+'/paymentmodes';
    var factory = {
    	finalCheckOut: finalCheckOut,
        paytmCheckout: paytmCheckout,
        uploadPrescriptionFile:uploadPrescriptionFile,
        paymentOptions:paymentOptions
        
    };
    return factory;


    function finalCheckOut(Order) {
        //console.log("order details :" + JSON.stringify(Order));
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.post(REST_CUSTOMER_CHECKOUT_SERVICE_URI,Order,{        
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

   function uploadPrescriptionFile(file){
    var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.post(REST_CUSTOMER_FILEUPLOAD_SERVICE_URI,file,{
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined,'Authorization': tokenCookie}
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

    function paymentOptions() {
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.get(REST_CUSTOMER_PAYMENT_OPTION_URI)
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


   function paytmCheckout(Order) {
        console.log("order details :" + JSON.stringify(Order));
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        $http.post(REST_CUSTOMER_PAYTM_CHECKOUT_SERVICE_URI,Order,{        
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
