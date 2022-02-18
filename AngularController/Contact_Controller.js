'use strict';

angular.module('myApp').controller('ContactController', ['$scope','$http','$route','$cookies','ContactService','$location','$timeout', 'LoginService' , '$rootScope' , function($scope,$http,$route,$cookies,ContactService,$location,$timeout,LoginService,$rootScope) {
//angular.module('myApp').controller('UserController', ['$scope', function($scope) {
    var self = this;
    $scope.coma = ',';
     //setSrc();
    // $scope.eml_add = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    self.contact={};
    self.succMsg = '';
    $scope.isCheck = false;
     // self.register={addresses:[]};
    
     
    self.contactSubmit = contactSubmit;

    //   function setSrc(){
			 //  document.getElementById('Contact_map').src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.8053208893607!2d88.39688391541856!3d22.586383438155675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275f0222cfdb7%3A0x99b24e05e822d26e!2sSharobi+Technologies+(India)+Pvt.+Ltd.!5e0!3m2!1sen!2sin!4v1560318006706!5m2!1sen!2sin";
				// }


    // alert("Hi");
    $(".ng-not-empty").val(""); 
    $scope.statusCookie = $cookies.get('Status');
    // alert($scope.statusCookie);          




     // ............................new code...............................

    angular.element(document).ready(function () {
    var cart_items_dup = localStorage.getItem("cartLocalStorage");

    if($rootScope.statusCookie != "Active"){
          $rootScope.cartdata_dup = JSON.parse(localStorage.getItem("cartLocalStorage"));
          if ($rootScope.cartdata_dup !== null){
      }
    }else {
        $scope.itemlist_dup = '';
        $rootScope.cartdata_dup=[];
        LoginService.callCartData()
            .then(
                function successCallback(response) {
                     $scope.cart_dup = response;
                     // console.log("console part cart" + JSON.stringify(response.data));
                    if (response.length > 0){
                        for ($scope.i = 0; $scope.i < response.length; $scope.i++) {
                            if ($scope.itemlist_dup == "") {
                                $scope.itemlist_dup = response[$scope.i].itemId;
                                // getCartDataDetails_dup($scope.itemlist_dup);
                            } else {
                                $scope.itemlist_dup = $scope.itemlist_dup + $scope.coma + response[$scope.i].itemId;
                                // getCartDataDetails_dup($scope.itemlist_dup);
                            }
                        }
                        getCartDataDetails_dup($scope.itemlist_dup);
                    }  
                },
                function error(response) {
                    $scope.msg = "Invalid login credentials";
                }

            );
    }




    function getCartDataDetails_dup(idlist) {
        
           $http.get(serverurl+"/items/itemsdetailsbyids?itemIds=" + idlist)         
             .then(
                function(response) {
                     $rootScope.cartdata_dup = response.data;

                     for (var i = 0; i < $rootScope.cartdata_dup.length; i++) {
                         for (var m = 0; m < $scope.cart_dup.length; m++) {
                            if ($rootScope.cartdata_dup[i].id == $scope.cart_dup[m].itemId) {
                             $rootScope.cartdata_dup[i].packQty = $scope.cart_dup[m].packQty;
                        }
                      }
                      
                    }
                },
                function(errResponse) {}
            );
    }

});

    // ..............................new code end........................





    function contactSubmit(){

         var fullName = self.contact.name.split(' ');
         self.contact.fname = fullName[0];
         self.contact.lname = '';
         for(var l=1;  l<fullName.length ; l++){
             self.contact.lname = self.contact.lname + " " + fullName[l] ;
         }
         // self.contact.lname = fullName[fullName.length - 1];
         // console.log("contact:: ",self.contact);
         // console.log("contact:: "+JSON.stringify(self.contact));
         // $scope.succMsg = "Succesfully Submitted Your Form";
         // self.contact={};
         // $scope.contactForm.$setPristine();
         // $scope.contactForm.$setUntouched();
         // $timeout(function() {
         //            $scope.succMsg = '';
         //        }, 4000);
         

         // $location.path( "/yewmed/contactus" );
        ContactService.createContactus(self.contact)
             .then(
             function successCallback(response) {
                 // console.log('User created successfully');
                 //var successMessage = 'User created successfully';
                 // console.log('createContactus', response);
                 // $("#usercreated").text(response.data.message);
               //$("#login").show();
               /*$location.path( "/yewmed/" );
               $location.path( "/yewmed/register" );*/
              // $scope.succMsg = response.data.message;
              // console.log(response);
               self.succMsg =  response.message;
               // console.log(self.succMsg);
               $("#usercreated").text(response.message);
                 self.contact={};
                 $scope.contactForm.$setPristine();
                 $scope.contactForm.$setUntouched();
                 $timeout(function() {
                            $("#usercreated").text('');
                        }, 4000);
            },  
             function error(response) {
             console.error('Error while creating User');
             $("#usernotcreated").text('Error while creating User');
             self.contact={};
             $scope.contactForm.$setPristine();
             $scope.contactForm.$setUntouched();
             $timeout(function() {
                            $("#usernotcreated").text('');
                        }, 4000);
             self.errorMessage = 'Error while creating User: ' + response.data.message;
             self.successMessage='';
             /*$scope.msg="Please provide valid details";*/
                    
              }
              
             /*function(errResponse){
                 console.error('Error while creating User');
             }*/
         );
     }
   
   /*function myMap() {
var mapProp= {
  center:new google.maps.LatLng(51.508742,-0.120850),
  zoom:5,
};
var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}*/
   
//-------------------------------------FOR USER REGISTRATION START---------------------------------------------------------------------------

}]);
