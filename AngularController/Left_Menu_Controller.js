/**
 * 
 */
'use strict';
angular.module('myApp').controller('LeftMenuController', ['$route','$location','$scope','LoginService','$rootScope', function($route,$location,$scope,LoginService,$rootScope) {
    var self = this;  
    $scope.oneAtATime = true;
       

    // alert("Hi");
    $(".ng-not-empty").val("");


    //alert("In LeftMenuController");
    $scope.categoriesMenu = [];
    
    
   
       LoginService.categoriesMenuRequest()
              .then(
              function successCallback(response) {
                // console.log("categoriesMenu Details:"+JSON.stringify(response.data));
                self.categoriesMenu = response.data;
                    },  
                      function error(response) {
                      self.categoriesMenu="categoriesMenu not found";
                      }
              /*function(errResponse){
                  console.error('Error while creating User');
              }*/
          );

        self.viewProducts = function(type,id) {
          if(id>0) {
            // console.log("location path = "+$location.path())
            // console.log("item clicked "+type+" id= "+id);
            self.products = {"type":type,"id":id};
            // console.log("item clicked "+self.products.type+" id= "+self.products.id);
            window.localStorage.setItem("productsBy",JSON.stringify(self.products));
            if($location.path() == $rootScope.contextpath+"/products") {
              $route.reload();
            } else {
              $location.path( $rootScope.contextpath+"/products");
            }
            //$route.reload();
          }
          
         }

    
}]);
