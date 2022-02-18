/**
 * 
 */
/*'use strict';
angular.module('myApp').controller('ProductsController', ['$location','$http','$scope', function($location,$http,$scope) {
    var self = this;
       
    //alert("In ProductsController");

    self.productsBy = JSON.parse(window.localStorage.getItem("productsBy"));
    if(self.productsBy==undefined ) {
      $location.path( "/yewmed");
      return;
    } 
    // alert(self.productsBy.id);

    self.products = [];
    $( document ).ready(function() {
      $("#carouselBlk").hide();
    });
   
  	$http.get(serverurl+"/items/details/"+self.productsBy.type+"/"+self.productsBy.id+"?page=1&limit=10")
       .then(
       function (response) {
         self.products=response.data;
         //console.log(JSON.stringify(response.data))
       },
       function(errResponse){
       }
    );
    self.viewItems = function(pid) {
      if(pid>0) {
        window.localStorage.setItem('selecteditemid',pid);
          $location.path( "/yewmed/product"); 
      }
    }
}]);*/
/**
 * 
 */
'use strict';
angular.module('myApp').controller('ProductsController', ['$route','$location','$http','$scope','$rootScope', function($route,$location,$http,$scope,$rootScope) {
    var self = this;

    var pageNo = 1;
    var subPageLimit = 1;
    $scope.scrollStatus = false;
    $scope.loadButtonShow = false;

    self.limit = 10;
       
    //alert("In ProductsController");


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
                    if (response.length > 0){
                        for ($scope.i = 0; $scope.i < response.length; $scope.i++) {
                            if ($scope.itemlist_dup == "") {
                                $scope.itemlist_dup = response[$scope.i].itemId;
                                getCartDataDetails_dup($scope.itemlist_dup);
                            } else {
                                $scope.itemlist_dup = $scope.itemlist_dup + $scope.coma + response[$scope.i].itemId;
                                alert($scope.itemlist_dup);
                                getCartDataDetails_dup($scope.itemlist_dup);
                            }
                        }
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
                     //console.log("console part cart" + JSON.stringify(response.data));

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


    self.productsBy = JSON.parse(window.localStorage.getItem("productsBy"));
    if(self.productsBy==undefined ) {
      $location.path( $rootScope.contextpath1);
      return;
    }
    if(self.productsBy.pno == undefined) {
      self.productsBy.pno=1;
    }
    // alert(self.productsBy.id);


    // alert("Hi");
    $(".ng-not-empty").val("");
    

    self.products = [];
    $( document ).ready(function() {
      $("#carouselBlk").hide();
    });
   
   
 $http.get(serverurl+"/items/details/"+self.productsBy.type+"/"+self.productsBy.id+"?page="+self.productsBy.pno+"&limit="+self.limit)       
        .then(
       function (response) {
         self.products=response.data;
         //console.log(JSON.stringify(response.data))
       },
       function(errResponse){
       }
    );

$http.get(serverurl+"/items/count/"+self.productsBy.type+"/"+self.productsBy.id)       
        .then(
       function (response) {
         self.productsCount= new Array(parseInt(response.data.status));
         //console.log(JSON.stringify(response.data))
         //console.log("Total count = "+self.productsCount);
       },
       function(errResponse){
       }
    );
    self.viewItems = function(pid) {
      if(pid>0) {
        window.localStorage.setItem('selecteditemid',pid);
          $location.path( $rootScope.contextpath+"/product"); 
      }
    }

    self.goToPage = function(pno) {
        //console.log("clicked");
          //$location.path( "/yewmed/product"); 
          self.productsBy.pno = pno;
          window.localStorage.setItem("productsBy",JSON.stringify(self.productsBy));
          $route.reload();
    }

    $scope.loadMore = function() {
      
      if(subPageLimit>=2) {
        $scope.loadButtonShow = true;
        $scope.scrollStatus=true;
      } else {
        pageNo++;
     
   $http.get(serverurl+"/items/details/"+self.productsBy.type+"/"+self.productsBy.id+"?page="+pageNo+"&limit="+self.limit)         
        .then(
         function (response) {
            
            subPageLimit++;
            $scope.scrollStatus=false;
            if(response.data[0]!=null || response.data[0]!=undefined ) {
              //self.products.concat(response.data);
              self.products = self.products.concat(response.data);
            } else {
              $scope.scrollStatus=true;
              $scope.loadButtonShow = false;
            }
           //console.log(JSON.stringify(self.products))
         },
         function(errResponse){
         }
      );
       }
  };

  $scope.getproducts = function() {
    return self.products;
  };

  $scope.scrollStart = function() {
    $scope.scrollStatus=false;
    subPageLimit=1;
    //$scope.digest();
  }

}]);
