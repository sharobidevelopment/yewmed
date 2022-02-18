'use strict';
angular.module('myApp').controller('WishListController', ['$http', '$scope', '$rootScope', '$location', '$route', 'LoginService', 'ProductDetailService', 'CartService','CommonService', '$timeout', '$cookies','$routeParams', function($http, $scope, $rootScope, $location, $route, LoginService, ProductDetailService, CartService,CommonService, $timeout, $cookies,$routeParams) {
    var self = this;
    var wishListItems=[];
    $scope.wishListData=[];
    $scope.coma = ',';
    get_cart_product_dup();
    getWishList();

    // alert("Hi");
    $(".ng-not-empty").val("");


// ...............................call cart at navbar part ..........................


// function get_cart_product_dup(){
//     if($rootScope.statusCookie != "Active"){
//           $rootScope.cartdata_dup = JSON.parse(localStorage.getItem("cartLocalStorage"));
//           if ($rootScope.cartdata_dup !== null){
//       }
//     }else {
//         alert("Hi");
//         $scope.itemlist_dup = '';
//         $rootScope.cartdata_dup=[];
//         LoginService.callCartData()
//             .then(
//                 function successCallback(response) {
//                      alert(JSON.stringify(response));
//                      $scope.cart_dup = response;
//                     if (response.length > 0){
//                         for ($scope.i = 0; $scope.i < response.length; $scope.i++) {
//                             if ($scope.itemlist_dup == "") {
//                                 $scope.itemlist_dup = response[$scope.i].itemId;
//                                 getCartDataDetails_dup($scope.itemlist_dup);
//                             } else {
//                                 $scope.itemlist_dup = $scope.itemlist_dup + $scope.coma + response[$scope.i].itemId;
//                                 getCartDataDetails_dup($scope.itemlist_dup);
//                             }
//                         }
//                     }

//                 },
//                 function error(response) {
//                     $scope.msg = "Invalid login credentials";
//                 }

//             );
//     }
//   }




//   function getCartDataDetails_dup(idlist) {
        
//            $http.get(serverurl+"/items/itemsdetailsbyids?itemIds=" + idlist)         
//              .then(
//                 function(response) {
//                      $rootScope.cartdata_dup = response.data;
//                      //console.log("console part cart" + JSON.stringify(response.data));
//                      for (var i = 0; i < $rootScope.cartdata_dup.length; i++) {
//                          for (var m = 0; m < $scope.cart_dup.length; m++) {
//                             if ($rootScope.cartdata_dup[i].id == $scope.cart_dup[m].itemId) {
//                              $rootScope.cartdata_dup[i].packQty = $scope.cart_dup[m].packQty;
//                         }
//                       }
                      
//                     }
//                 },
//                 function(errResponse) {}
//             );
//     }





    // ...............................call cart at navbar part end..........................




   // ............................new code...............................

    var cart_items_dup = localStorage.getItem("cartLocalStorage");

    function get_cart_product_dup(){
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
                                // getCartDataDetails_dup($scope.itemlist_dup);
                            } else {
                                $scope.itemlist_dup = $scope.itemlist_dup + $scope.coma + response[$scope.i].itemId;
                                // getCartDataDetails_dup($scope.itemlist_dup);
                                // alert($scope.itemlist_dup);
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

    // ..............................new code end........................




     
     
function  getWishList(){
     var tokenCookie = $cookies.get('Token');
     $http.get(serverurl+"/cart/wishlist",{        
            headers:{'Authorization': tokenCookie}
                }).then(
            function(response) {
              //console.log(response.data);
               localStorage.setItem("wishListLocalStorage", JSON.stringify(response.data));
                $rootScope.totalitemsinwishlist=response.data.length;
               createParameterForCallWishListData();
             },
            function(errResponse) {}
            );
  }
  

/*$scope.viewItems = function(pid) {
        //alert("viewItems"+pid);
          if(pid>0) {
            window.localStorage.setItem('selecteditemid',pid);
              $location.path( "/yewmed/product"); 
          }
        }*/


 function createParameterForCallWishListData() {
        var itemlist = "";
        var coma = ",";
        var items ="";
        
         if (localStorage.getItem("wishListLocalStorage") != null) {
           wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
            if (wishListItems.length > 0) {
                  for (var i = 0; i < wishListItems.length; i++) {
                    if (itemlist == "") {
                        itemlist = wishListItems[i].itemId;
                    } else {
                        itemlist = itemlist + coma + wishListItems[i].itemId;
                    }
                    
                }
            }
        }
      
        if (wishListItems.length > 0) {
            getWishListDataDetails(itemlist);
        } else {
           clearWishList();
        }
    }


function  getWishListDataDetails(itemlist){
     $http.get(serverurl+"/items/itemsdetailsbyids?itemIds=" + itemlist)
             .then(
                function(response) {

                     $scope.wishListData = response.data;
                     //console.log("Whistlist Data : " + JSON.stringify($scope.wishListData));
                  },
                function(errResponse) {}
            );
}



function  clearWishList(){
    wishListItems=[];
    $scope.wishListData = [];
}


$scope.toggleAll = function() {
        var wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
        if ($("#isAllSelected").prop('checked') == true) {
            $(".child").prop("checked", true);
        } else {
            $(".child").prop("checked", false);
        }
        // var count = 0;
        $scope.checked_count = 0;
        var v = document.getElementsByName("selecteditem_checkbox");

        for (var i = 0; i < $scope.wishListData.length; i++) {
            var trid = $scope.wishListData[i].id;
            if ($("#selecteditem_checkbox_" + trid).prop("checked") == true) {
                // count++;
                // $scope.checked_count = count;
            } else {}
        }
    }


 $scope.toggleSingle = function() {
     var wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
     // alert(wishListItems.length);
     var count = 0;
     $scope.checked_count = 0;
     // var v = document.getElementsByName("selecteditem_checkbox");
     // alert(v.length);
     for (var i = 0; i < $scope.wishListData.length; i++) {
            var trid = $scope.wishListData[i].id;
            if ($("#selecteditem_checkbox_" + trid).prop("checked") == true) {
                count++;
                $scope.checked_count = count;
                if($scope.checked_count == $scope.wishListData.length) {
                   $("#isAllSelected").prop("checked", true);
                }
                else{
                   $("#isAllSelected").prop("checked", false);
                }
            } else {
                   $("#isAllSelected").prop("checked", false);
            }
        }
 }


$scope.moveToCart = function(){
            var selecteitem = [];
            var movetocartitemlist = "";
            var wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
          
            var coma = ',';
            var v = document.getElementsByName("selecteditem_checkbox");
            // alert(v.length);
            for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                  for (var j = 0; j < wishListItems.length; j++) {
                    if (wishListItems[j].itemId==v[i].value) {
                         selecteitem.push(wishListItems[j].id);
                         //console.log(selecteitem);
                         break;
                     } 
                 }
               }
            }
       if(selecteitem.length>0){    
      var tokenCookie = $cookies.get('Token');
      $http.put(serverurl+"/cart/wishlisttocart",selecteitem,{                 
      headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
        localStorage.setItem("wishListLocalStorage", JSON.stringify(response.data));
        $rootScope.totalitemsinwishlist=response.data.length; 
        callCart() ;
        /*createParameterForCallWishListData();*/
          },
       function(errResponse){ }
   );
   }
   else{
     // alertify.confirm("Please Select Item To Move Into Cart")
    //$.alert.open('Please Select Item To Move Into Cart');
     $("#isAllSelected").prop("checked", true)
     $(".child").prop("checked", true);
       for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                  for (var j = 0; j < wishListItems.length; j++) {
                    if (wishListItems[j].itemId==v[i].value) {
                         selecteitem.push(wishListItems[j].id);
                         //console.log(selecteitem);
                         break;
                     } 
                 }
               }
            }
       if(selecteitem.length>0){    
      var tokenCookie = $cookies.get('Token');
      $http.put(serverurl+"/cart/wishlisttocart",selecteitem,{                 
      headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
        localStorage.setItem("wishListLocalStorage", JSON.stringify(response.data));
        $rootScope.totalitemsinwishlist=response.data.length; 
        callCart() ;
        /*createParameterForCallWishListData();*/
          },
       function(errResponse){ }
     );
    }
   }

}
 function callCart() {
        LoginService.callCartData()
            .then(
                function successCallback(response) {
                    localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                    $rootScope.totalitemsincart = response.length;
                    $route.reload();
                },
                function error(response) {
                    $scope.msg = "Invalid login credentials";
                }

            );
    }



 



$scope.remove_itmfromwishlist = function(itemid){
    alertify.set({ buttonReverse: true });
      alertify.confirm("Are you sure?", function (e) {
        if (e) {
   var wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
   var deletableid ="";
        for (var j = 0; j < wishListItems.length; j++) {
                if (wishListItems[j].itemId==itemid) {
                         deletableid=wishListItems[j].id;
                         break;
                     } 
                 }
                  

      var tokenCookie = $cookies.get('Token');
      $http.delete(serverurl+"/cart/wishlist/delete/"+deletableid,{                 
      headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
        localStorage.setItem("wishListLocalStorage", JSON.stringify(response.data));
        $rootScope.totalitemsinwishlist=response.data.length; 
        createParameterForCallWishListData();
          },
       function(errResponse){ }
   );

  }
  else{

  }
  });
}

// self.viewItems = function(pid,grpid,grpname,catename) {
//           if(pid>0) {
//               window.localStorage.setItem('selecteditemid',pid);
//               window.localStorage.setItem("groupId",grpid);
//               window.localStorage.setItem("grpname",grpname);
//               window.localStorage.setItem("catename",catename);
//               $location.path( $rootScope.contextpath+"/product"); 
//           }
          
//         }




}]);