/**
 * 
 */

'use strict';
angular.module('myApp').factory('ProductDetailService', ['$http', '$q','$cookies', function($http, $q,$cookies){

    
    var REST_GET_SELECTED_PRODUCT_DETAILS_SERVICE_URI = serverurl+'/items/details/';
    var REST_GET_SELECTED_PRODUCT_ADD_TO_CART = serverurl+'/cart';
    var REST_GET_SELECTED_PRODUCT_ADD_BULK_TO_CART = serverurl+'/cart/addinbulk';
    var REST_GET_CHECK_PRODUCT_SALABILITY=serverurl+'/items/checkdeliverable?id=';
    var REST_GET_CHECK_PRODUCT_SALABILITY_BYPINCODE=serverurl+'/items/checkdeliverableByPin?id=';
    var REST_GET_SELECTED_PRODUCT_UPDATE_BULK_TO_CART = serverurl+'/cart/updateinbulk';
    var REST_GET_SELECTED_PRODUCT_DELETE_ITEM_FROM_CART = serverurl+'/cart/delete/';
    var REST_GET_SELECTED_PRODUCT_ADD_TO_WISHLIST = serverurl+'/cart/wishlist';
    var factory = {
    		selectedProductDetailsRequest: selectedProductDetailsRequest,  
            addItemInCart:addItemInCart,
            addItemInLocalStorage:addItemInLocalStorage,
            addBulkItemInCart:addBulkItemInCart,
            checkSalabilityByItem:checkSalabilityByItem,
            checkSalabilityByItemandPincode:checkSalabilityByItemandPincode,
            updateBulkItemInCart:updateBulkItemInCart,
            deleteItemFromCart:deleteItemFromCart ,
            inputItemInWishList:inputItemInWishList    
    };
    return factory;

    

    function selectedProductDetailsRequest(itemid) {
    	//alert(REST_GET_SELECTED_PRODUCT_DETAILS_SERVICE_URI+itemid);
        var deferred = $q.defer();
        $http.get(REST_GET_SELECTED_PRODUCT_DETAILS_SERVICE_URI+itemid)
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
    




function addItemInCart(cart) {
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
        //console.log("Print cart at service"+ JSON.stringify(cart));
            $http.post(REST_GET_SELECTED_PRODUCT_ADD_TO_CART, cart,{        
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




function addItemInLocalStorage(cart){
        var deferred = $q.defer();
            $http.get(REST_GET_SELECTED_PRODUCT_DETAILS_SERVICE_URI+cart.itemId)
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


function addBulkItemInCart(item){
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
            $http.post(REST_GET_SELECTED_PRODUCT_ADD_BULK_TO_CART,item,{        
                            headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                //console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
            return deferred.promise;
}
function checkSalabilityByItem(itemid,latitude,longitude){
       //alert("itemid: "+itemid+",lat: "+latitude+",lon: "+longitude);
        var deferred = $q.defer();
            $http.get(REST_GET_CHECK_PRODUCT_SALABILITY+itemid+'&lat='+latitude+'&lng='+longitude)
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('error');
                deferred.reject(errResponse);
            }
        );
            return deferred.promise;
}


function checkSalabilityByItemandPincode(itemid,pincode){
       // alert("itemid: "+itemid+",pincode: "+pincode);
        var deferred = $q.defer();
            $http.get(REST_GET_CHECK_PRODUCT_SALABILITY_BYPINCODE+itemid+'&pinCode='+pincode)
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('error');
                deferred.reject(errResponse);
            }
        );
            return deferred.promise;
}



function updateBulkItemInCart(item){
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
            $http.post(REST_GET_SELECTED_PRODUCT_UPDATE_BULK_TO_CART,item,{        
                            headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                deferred.resolve(response.data);
            },
            function(errResponse){
                //console.error('Error while login User');
                deferred.reject(errResponse);
            }
        );
            return deferred.promise;
}

function deleteItemFromCart(itemid){
        var deferred = $q.defer();
         var tokenCookie = $cookies.get('Token');
            $http.get(REST_GET_SELECTED_PRODUCT_DELETE_ITEM_FROM_CART+itemid,{        
                            headers:{'Authorization': tokenCookie}
                  })
            .then(
            function (response) {
                deferred.resolve(response);
            },
            function(errResponse){
                //console.error('error');
                deferred.reject(errResponse);
            }
        );
            return deferred.promise;
}



function inputItemInWishList(wistItem) {
        var tokenCookie = $cookies.get('Token');
        var deferred = $q.defer();
            $http.post(REST_GET_SELECTED_PRODUCT_ADD_TO_WISHLIST, wistItem,{        
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

}]);
