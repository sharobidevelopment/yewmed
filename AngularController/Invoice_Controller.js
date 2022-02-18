'use strict';

var App = angular.module('myApp');
App.controller('InvoiceController', ['$scope','$cookies','$http','$route','$location', 'LoginService' , '$rootScope' , function($scope,$cookies,$http,$route,$location,LoginService,$rootScope) {
    var self = this;
    userAuthorizationChecked();
    $scope.shippingAddress = {};
    invoiceCall();
    $scope.orders = [];
   //$scope.invoice = {};

   $scope.orders = JSON.parse(localStorage.getItem("Ordersdetails"));
  // self.orders = localStorage.getItem("Ordersdetails");
/*$scope.ordersdetails = JSON.parse(localStorage.getItem("Ordersdetails"));
    console.log("Ordersdetails:"+$scope.ordersdetails)
    for (var i = $scope.ordersdetails.length-1; i >= 0; i--) {
                   console.log("ordersdetails id: "+$scope.ordersdetails[i].id);
    }
    */


    // alert("Hi");
    $(".ng-not-empty").val("");



    // ............................new code...............................

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
                                // alert($scope.itemlist_dup);
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
                     console.log("console part cart" + JSON.stringify(response.data));

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



function userAuthorizationChecked(){
    //alert("userChecked");
      var tokenCookie = $cookies.get('Token');
    console.log("tokenCookie userChecked found:"+tokenCookie)
     if(tokenCookie==""){
      $location.path( $rootScope.contextpath1);
    }
  }

//$scope.invoiceCall = function(aid) {
function invoiceCall() {
    $scope.invoice =JSON.parse(localStorage.getItem('invoice'));
    console.log("Order for invoice:"+JSON.stringify($scope.invoice));
    var tokenCookie = $cookies.get('Token');
    //var loggedinuserdetails = JSON.parse(localStorage.getItem("loggedinuserdetails"));

     var tokenCookie = $cookies.get('Token');
        $http.get(serverurl+"/users/details",{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         console.log("response Users:"+JSON.stringify(response.data))
         $scope.loggedinuserdetails = response.data;
         console.log("Adreessss : " + JSON.stringify($scope.loggedinuserdetails));
            console.log("tokenCookie found:"+tokenCookie)
    console.log("loggedinuserdetails:"+$scope.loggedinuserdetails.addresses)
    for (var i = $scope.loggedinuserdetails.addresses.length-1; i >= 0; i--) {
    console.log("loggedinuserdetails:"+loggedinuserdetails.addresses[i].id+" = "+$scope.invoice.customerAddressId)
     if($scope.loggedinuserdetails.addresses[i].id== $scope.invoice.customerAddressId) {
          $scope.shippingAddress =$scope.loggedinuserdetails.addresses[i];
         console.log("$scope.shippingAddress:"+JSON.stringify($scope.shippingAddress))
         break;
     } else {
      $scope.shippingAddress = null;
     }
 }
       },
       function(errResponse){
          console.error("errResponse:"+'Error while fetching users details');
           
       }
     );

    // $scope.email=$scope.loggedinuserdetails.email;
 
}

$scope.Export = function () {
            html2canvas(document.getElementById('tblCustomers'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("invoice.pdf");
                }
            });
        }
/*-------------------------CallOrders Start------------------------------------------------*/

/*-------------------------convertNumberToWords Start------------------------------------------------*/
convertNumberToWords($scope.invoice.netAmount);
function convertNumberToWords(amount) {
    //alert("convertNumberToWords: "+amount);
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        var value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    console.log("words_string: "+words_string+" "+amount);
    $scope.convertToWords = words_string+"  only.";
    return words_string;
}
/*-------------------------convertNumberToWords Start------------------------------------------------*/

}]);