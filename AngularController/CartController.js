'use strict';
angular.module('myApp').controller('CartController', ['$http', '$scope', '$rootScope', '$location', '$route', 'LoginService', 'ProductDetailService', 'CartService','CommonService', '$timeout', '$cookies','$routeParams' , '$interval', function($http, $scope, $rootScope, $location, $route, LoginService, ProductDetailService, CartService,CommonService, $timeout, $cookies,$routeParams,$interval) {
    var self = this;
    $rootScope.cartdata = [];
    $scope.cartItemTotalQtydata = [];
    $scope.itemPricedata = [];
    $scope.itemQuantitydata = [];
    $scope.addressData = [];
    $scope.countries=[];
    $scope.states=[];
    $scope.cities=[];
    $scope.crtMsg = "";
    $scope.coma = ',';
    $scope.isCheck = false;
    $scope.statusCookie = $cookies.get('Status');
    $scope.selectedaddress="";
    $scope.selected_country="";
    $scope.selected_state="";
    $scope.selected_city="";
    $scope.newaddress={};
    get_cart_product_dup();
    $scope.selected_itemid_for_show = "";
    $("#sub_total").html("0.00");
    $("#total_discount").html("0.00");
    $("#total_tax").html("0.00");
    $("#total_amount").html("0.00");
    $("#total_payableamt").html("0.00");
    
    // alert("Hi");
    $(".ng-not-empty").val("");

    $(".child").prop("checked", true);


    // ............................new code...............................

    var cart_items_dup = localStorage.getItem("cartLocalStorage");

    function get_cart_product_dup() {
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
                                // alert($scope.itemlist_dup);
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
}




    function getCartDataDetails_dup(idlist) {
        
           $http.get(serverurl+"/items/itemsdetailsbyids?itemIds=" + idlist)         
             .then(
                function(response) {
                     $rootScope.cartdata_dup = response.data;
                     // console.log("console part cart" + JSON.stringify(response.data));

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



  

   if ($scope.statusCookie == 'Active') { 
    callCart();// call for get updated cart data 
    } 
    else{
    createParameterForCallCartData();
    }
    callCountries();
    
     /*var idParam = $routeParams.primaryNav;
     if(idParam=='fromorder'){
         callScratch();
     }*/
    /* if($rootScope.primaryNav=="successOrder"){
       callScratch();
     }*/





    $scope.statusCookie = $cookies.get('Status');
    if ($scope.statusCookie === undefined) {
        $scope.statusCookie = 'Deactive';
    }
    if ($scope.statusCookie == 'Active') {
        var loggedinuserdata = JSON.parse(localStorage.getItem("loggedinuserdetails"));
        if (loggedinuserdata != null) {
            $scope.addressData = loggedinuserdata.addresses;
        }
    }
    

  
    function getCustomerAddressData(){
     CartService.callCustomerAddressData()
         .then(
             function successCallback(response) {
                 $scope.addressData=response.addresses;
                 localStorage.setItem("loggedinuserdetails", JSON.stringify(response));
                },
             function error(response) { }

         );
    }
    


$scope.getStatesForSetAddress = function() {
  CommonService.getStateList($scope.selectedaddress.countryId)
            .then(
                function successCallback(response) {
                  $scope.states=response;
                },
                function error(response) {
                    console.log("Error Occoured In Fetching States");
                }
            );
 };
 
 $scope.getCitiesForSetAddress= function() {
  CommonService.getCityList($scope.selectedaddress.stateId)
            .then(
                function successCallback(response) {
                  $scope.cities=response;
                },
                function error(response) {
                    console.log("Error Occoured In Fetching Cities");
                }
            );
 };
 
 
 $scope.getStates = function(param) {
  /*alert("getStates"+param);*/
     $scope.parameter='';
     if(param=='1'){
      /*alert("param::"+param);*/
       $scope.parameter=$scope.newaddress.countryId;
       /*$scope.newaddress.stateId="";
       $scope.newaddress.cityId="";*/

     }
     if(param=='2'){
      /*alert("param::"+param);*/
        $scope.parameter=$scope.selectedaddress.countryId;
        /*$scope.selectedaddress.stateId="";
        $scope.selectedaddress.cityId="";*/
     }
     /*alert("Selected country:"+$scope.parameter);*/
     CommonService.getStateList($scope.parameter)
            .then(
                function successCallback(response) {
                  $scope.states=response;
                },
                function error(response) {
                    console.log("Error Occoured In Fetching States");
                }
            );
 };


$scope.getCities= function(param) {
 /*alert("getCities::"+param);*/
  $scope.parameter='';
     if(param=='1'){
       // alert("param::"+param);
       $scope.parameter=$scope.newaddress.stateId;
     }
     if(param=='2'){
       /*alert("param::"+param);*/
        $scope.parameter=$scope.selectedaddress.stateId;
     }
     /* alert("Set param:"+$scope.parameter);*/
      CommonService.getCityList($scope.parameter)
            .then(
                function successCallback(response) {
                  $scope.cities=response;
                },
                function error(response) {
                    console.log("Error Occoured In Fetching Cities");
                }
            );
 };











/* Code For Show Selected Shipping Address In Cart Page (start)*/
     // $scope.setShippingAddress = function () {
     //    var addressData=[];
     //    $scope.addressid=localStorage.getItem("addressid");
     //    if (localStorage.getItem("loggedinuserdetails") == null) {
     //         getCustomerAddressData();
     //         var loggedinuserdata=JSON.parse(localStorage.getItem("loggedinuserdetails"));
     //         addressData=loggedinuserdata.addresses;
     //     }
     //     else{
     //         var loggedinuserdata=JSON.parse(localStorage.getItem("loggedinuserdetails"));
     //         addressData=loggedinuserdata.addresses;
     //     }
           
    
     //    if($scope.addressid == null){
     //           console.log("addressData.........." + JSON.stringify(addressData));
     //           for(var k=0;k<addressData.length;k++){
     //               if(addressData[k].isDefault == '1'){
     //                  $scope.addressid=addressData[k].id;
     //                  $scope.selectedaddress=addressData[k];
     //                  break;
     //               }
     //             }
     //           }
     //    else{
     //      for(var k=0;k<addressData.length;k++){
     //               if(addressData[k].id == $scope.addressid){
     //                   $scope.selectedaddress=addressData[k];
     //               }
     //             }
     //       }
     
     //    /* alert(JSON.stringify($scope.selectedaddress));*/
     //    /* $scope.selected_country=$scope.selectedaddress.countryId;
     //     $scope.selected_state=$scope.selectedaddress.stateId;
     //     $scope.selected_city=$scope.selectedaddress.cityId;*/
     //     $scope.getStatesForSetAddress();
     //     $scope.getCitiesForSetAddress();
         
     // }

    /* Code For Show Selected Shipping Address In Cart Page (end)*/
   
   if ($scope.statusCookie == 'Active') {
           // $scope.setShippingAddress();
      }

function callCountries() {
   CommonService.getCountryList()
            .then(
                function successCallback(response) {
                  $scope.countries=response;
                },
                function error(response) {
                    console.log("Error Occoured In Fetching Countries");
                }
            );
    }    
  
 function callCart() {
        LoginService.callCartData()
            .then(
                function successCallback(response) {
                    localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                    $rootScope.totalitemsincart = response.length;
                    createParameterForCallCartData();
                    //$route.reload();
                },
                function error(response) {
                    $scope.msg = "Invalid login credentials";
                }

            );
    }

   function createParameterForCallCartData() {
        $scope.itemlist = "";
        $scope.coma = ",";
        $scope.items = "";
        if (localStorage.getItem("cartLocalStorage") != null) {
            $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
            if ($scope.items.length > 0) {

                for ($scope.i = 0; $scope.i < $scope.items.length; $scope.i++) {
                    if ($scope.itemlist == "") {
                        $scope.itemlist = $scope.items[$scope.i].itemId;
                    } else {
                        $scope.itemlist = $scope.itemlist + $scope.coma + $scope.items[$scope.i].itemId;
                    }
                }
            }
        }
        /*else{
            LoginService.callCartData()
            .then(
            function successCallback(response) {
                 $scope.items = response;
                         if($scope.items.length>0){
                             for ($scope.i = 0; $scope.i < $scope.items.length; $scope.i++) {
                                if($scope.itemlist==""){
                                       $scope.itemlist=$scope.items[$scope.i].itemId;    
                                    }
                                else{
                                   $scope.itemlist=$scope.itemlist+$scope.coma+$scope.items[$scope.i].itemId;
                                    }
                              }
                            }
                      },  
                    function error(response) {
                     $scope.msg="Invalid login credentials";
                    }
            
            );
        }*/

        /* $scope.trimeditemlist = $scope.itemlist.substring(0, $scope.itemlist.length - 1);*/

        // console.log("id string::" + $scope.itemlist + " " + localStorage.getItem("userlat") + " " + localStorage.getItem("userlng"));

        if ($scope.items.length > 0) {
            getCartDataDetails($scope.itemlist, localStorage.getItem("userlat"), localStorage.getItem("userlng"));
        } else {
            clearCart();
        }
    }



    function getCartDataDetails(idlist, lat, lng) {

      // $("#loader").show();
        
           $http.get(serverurl+"/items/itemsdetailsbyids?itemIds=" + idlist)
            // $http.get(serverurl+"/items/cartitemsdetails?itemIds="+idlist+"&lat="+lat+"&lng="+lng)           
             .then(
                function(response) {
                    //$("#loader").hide();
                   /* $("#emptymsg").show();*/
                    // console.log("response data::" + JSON.stringify(response.data));
                    $rootScope.cartdata = response.data;

                    if($scope.statusCookie == 'Active'){
                        var tokenCookie = $cookies.get('Token');
                            $http.get(serverurl+"/users/details",{
                             headers:{'Authorization': tokenCookie}
                              })
                           .then(
                           function (response) {
                             $scope.users=response.data;
                             for(var x=0; x<$scope.users.addresses.length; x++){
                                    // alert($scope.users.addresses[x].isDefault);
                                    if($scope.users.addresses[x].isDefault == 1){
                                        var defaultaddfind = x;
                                        localStorage.setItem("defaultpincode", $scope.users.addresses[x].pincode);
                                          $http.get(serverurl+"/items/getitemqtyinradiusbypin?itemIds=" + idlist + "&pin=" + $scope.users.addresses[defaultaddfind].pincode)
                                    .then(
                                        function(response) {
                                            $scope.cartItemTotalQtydata = response.data;
                                            // console.log("Total qty data::" + JSON.stringify(response.data));
                                            for (var i = 0; i < $rootScope.cartdata.length; i++) {
                                                for (var m = 0; m < $scope.cartItemTotalQtydata.length; m++) {
                                                    if ($rootScope.cartdata[i].id == $scope.cartItemTotalQtydata[m].id) {
                                                        $rootScope.cartdata[i].totalCurrentPackQty = $scope.cartItemTotalQtydata[m].totalCurrentPackQty;
                                                    }
                                                }
                                            }
                                            generateCartDataDetails();
                                        });
                                    }
                                }
                               // var default_zipcode = $scope.users.addresses[defaultaddfind].pincode;
                           },
                           function(errResponse){
                              //console.error("errResponse:"+'Error while fetching users details');
                               
                              }
                            );  
                    }
                    else{
                    // $http.get(serverurl+"/items/getitemqtyinradius?itemIds=" + idlist + "&lat=" + lat + "&lng=" + lng)
                    $http.get(serverurl+"/items/getitemqtyinradiusbypin?itemIds=" + idlist + "&pin=" + 700064)
                        .then(
                            function(response) {
                                $scope.cartItemTotalQtydata = response.data;
                                // console.log("Total qty data::" + JSON.stringify(response.data));
                                for (var i = 0; i < $rootScope.cartdata.length; i++) {
                                    for (var m = 0; m < $scope.cartItemTotalQtydata.length; m++) {
                                        if ($rootScope.cartdata[i].id == $scope.cartItemTotalQtydata[m].id) {
                                            $rootScope.cartdata[i].totalCurrentPackQty = $scope.cartItemTotalQtydata[m].totalCurrentPackQty;
                                        }
                                    }
                                }
                                generateCartDataDetails();
                                $scope.toggleAll();
                            });
                        }


                },
                function(errResponse) {}
            );
    }




    function generateCartDataDetails() {
        $scope.itemQuantitydata = [];
        $scope.itemAvailabilityData = [];

        $scope.totaldiscountamt = 0;
        $scope.totaltaxamt = 0;
        $scope.totalamt = 0;

        //alert(localStorage.getItem("defaultpincode"));

        $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        // console.log("$scope.items data::" + JSON.stringify($scope.items));
        for (var i = 0; i < $rootScope.cartdata.length; i++) {
            for (var j = 0; j < $scope.items.length; j++) {
                if ($rootScope.cartdata[i].id == $scope.items[j].itemId) {
                    $scope.discountamt = 0;
                    $scope.itemQuantity = $scope.items[j].packQty;

                    if ($rootScope.cartdata[i].taxTypeId == 1) { //Tax Inclusive
                        $scope.baseprice = ($rootScope.cartdata[i].price / (1 + ($rootScope.cartdata[i].saleTaxPercentage / 100)));
                        if ($rootScope.cartdata[i].isDiscount == 1) {
                            $scope.discountamt = parseFloat(($scope.baseprice * $rootScope.cartdata[i].discount / 100)).toFixed(2);
                            $scope.taxableamt = ($scope.baseprice - $scope.discountamt);
                        } else {
                            $scope.taxableamt = $scope.baseprice;
                        }
                        $scope.taxamt = parseFloat($scope.itemQuantity * ($scope.taxableamt * $rootScope.cartdata[i].saleTaxPercentage / 100)).toFixed(2);
                        $scope.actualPrice = parseFloat(($scope.itemQuantity * Number($scope.taxableamt)) + Number($scope.taxamt)).toFixed(2);

                    } else { //Tax Exclusive
                        if ($rootScope.cartdata[i].isDiscount == 1) {
                            $scope.discountamt = parseFloat(($rootScope.cartdata[i].price * $rootScope.cartdata[i].discount / 100)).toFixed(2);
                            $scope.taxableamt = ($rootScope.cartdata[i].price - $scope.discountamt);
                        } else {
                            $scope.taxableamt = $rootScope.cartdata[i].price;
                        }
                        $scope.taxamt = parseFloat($scope.itemQuantity * ($scope.taxableamt * $rootScope.cartdata[i].saleTaxPercentage / 100)).toFixed(2);
                        $scope.actualPrice = parseFloat(($scope.itemQuantity * Number($scope.taxableamt)) + Number($scope.taxamt)).toFixed(2);
                    }

                    $scope.totaldiscountamt = parseFloat(Number($scope.totaldiscountamt) + Number($scope.discountamt)).toFixed(2);
                    $scope.totaltaxamt = parseFloat(Number($scope.totaltaxamt) + Number($scope.taxamt)).toFixed(2);
                    $scope.totalamt = parseFloat(Number($scope.totalamt) + Number($scope.actualPrice)).toFixed(2);


                    /*$scope.itemPricedata[i]= $scope.actualPrice;*/
                    $scope.itemPricedata[$rootScope.cartdata[i].id] = $scope.actualPrice;
                    $scope.itemQuantitydata[$rootScope.cartdata[i].id] = $scope.itemQuantity;



                    if ($rootScope.cartdata[i].totalCurrentPackQty != null) {
                        if ($scope.items[j].packQty <= $rootScope.cartdata[i].totalCurrentPackQty) {
                            $scope.itemAvailabilityData[$rootScope.cartdata[i].id] = 'Available';
                            // $scope.itemAvailabilityData[$rootScope.cartdata[i].id] = 'Available Quantity ' + $rootScope.cartdata[i].totalCurrentPackQty;
                        } else {
                            // $scope.itemAvailabilityData[$rootScope.cartdata[i].id] = 'Available Quantity ' + $rootScope.cartdata[i].totalCurrentPackQty;
                            $scope.itemAvailabilityData[$rootScope.cartdata[i].id] = 'Currently Unavailable';
                            $("#tr_"+$rootScope.cartdata[i].id).css("background", "#6c757d17");
                        }
                    } else {
                        $scope.itemAvailabilityData[$rootScope.cartdata[i].id] = 'Currently Unavailable';
                        // $scope.itemAvailabilityData[$rootScope.cartdata[i].id] = 'Not Available';
                        $("#tr_"+$rootScope.cartdata[i].id).css("background", "#6c757d17");
                    }



                }
            }
        }
       // $("#loader").hide();

       $scope.toggleAll();
    }




    function clearCart() {

        $scope.totaldiscountamt = 0;
        $scope.totaltaxamt = 0;
        $scope.totalamt = 0;
        $rootScope.cartdata = [];
        
    }


    $scope.delete_itmqnty = function(pid) {
        $("#sub_total").html("0.00");
        $("#total_discount").html("0.00");
         $("#total_tax").html("0.00");
        $("#total_amount").html("0.00");
        $("#total_payableamt").html("0.00");
        $('#isAllSelected').prop('checked', false);
        var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        for (var i = 0; i < cart_items.length; i++) {
            if (cart_items[i].itemId == pid) {
                if (cart_items[i].packQty != 1) {
                    cart_items[i].packQty = Number(cart_items[i].packQty) - 1;
                    if ($scope.statusCookie == 'Active') {
                        updateItemInCart(cart_items[i]);
                    }
                }
                //location.reload();
                //$route.reload();
                break;
            }
        }
        localStorage.setItem("cartLocalStorage", JSON.stringify(cart_items));
        createParameterForCallCartData();
        $('#isAllSelected').prop('checked', false);
        get_cart_product_dup();
    }

    $scope.add_itmqnty = function(pid) {
        $scope.isCheck = false;
        var currentqty = 0;
        /*for (var i = 0; i<$rootScope.cartdata.length; i++) {
            if($rootScope.cartdata[i].id==pid){
                 currentqty=$rootScope.cartdata[i].totalCurrentPackQty;
            }
        }*/


        $("#sub_total").html("0.00");
        $("#total_discount").html("0.00");
         $("#total_tax").html("0.00");
        $("#total_amount").html("0.00");
        $("#total_payableamt").html("0.00");

        
        
      for (var i = 0; i < $scope.cartItemTotalQtydata.length; i++) {
            if ($scope.cartItemTotalQtydata[i].id == pid) {
                currentqty = $scope.cartItemTotalQtydata[i].totalCurrentPackQty;
            }
        }

        var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        for (var i = 0; i < cart_items.length; i++) {
            if (cart_items[i].itemId == pid && cart_items[i].packQty < currentqty) {
                $scope.isCheck = false;
                $scope.crtMsg = "";
                cart_items[i].packQty = Number(cart_items[i].packQty) + 1;
                if ($scope.statusCookie == 'Active') {
                    updateItemInCart(cart_items[i]);
                }
                localStorage.setItem("cartLocalStorage", JSON.stringify(cart_items));
                createParameterForCallCartData();
                $('#isAllSelected').prop('checked', false);
                //location.reload();
                // $route.reload();
                //$state.reload();
                get_cart_product_dup();
                break;
            } else {
                $scope.crtMsg = "Can't increase quantity of this item. Please select quantity within stock.";
                $timeout(function() {
                    $scope.isCheck = true;
                }, 4000);
            }
        }

    }

    $scope.remove_itm = function(pid) {

      alertify.set({ buttonReverse: true });
      alertify.confirm("Are you sure?", function (e) {
        if (e) {
        var cart_id = 0;
        var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        for (var i = 0; i < cart_items.length; i++) {
            if (cart_items[i].itemId == pid) {
                cart_id = cart_items[i].id;
                //alert("cart-id"+cart_id);
                //alert(JSON.stringify(cart_items[i]));
                cart_items.splice(i,1);
                break;
            }
        }

        if ($scope.statusCookie == 'Active') {
            ProductDetailService.deleteItemFromCart(cart_id)
                .then(
                    function successCallback(response) {
                        $route.reload();
                    },
                    function error(response) {}
                );
                $("#isAllSelected").prop("checked", false);
                $("#sub_total").html("0.00");
                $("#total_discount").html("0.00");
                $("#total_tax").html("0.00");
                $("#total_amount").html("0.00");
                $("#total_payableamt").html("0.00");
                // $route.reload();
        }else{
            $route.reload();
        }
        
        /*if(cart_items.length==0){
            
             $rootScope.cartdata = [];
          }*/
        

        localStorage.setItem("cartLocalStorage", JSON.stringify(cart_items));
        $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;
        createParameterForCallCartData();
       }
      else{ }
      });


    }


    $scope.checkShippingPosibility = function(addid, lat, lng) {
        $scope.itemlist = "";
        $scope.coma = ",";
        $scope.items = "";
        if(lat!=null && lng!=null){
        if (localStorage.getItem("cartLocalStorage") != null) {
            $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
            if ($scope.items.length > 0) {
                for ($scope.i = 0; $scope.i < $scope.items.length; $scope.i++) {
                    if ($scope.itemlist == "") {
                        $scope.itemlist = $scope.items[$scope.i].itemId;
                    } else {
                        $scope.itemlist = $scope.itemlist + $scope.coma + $scope.items[$scope.i].itemId;
                    }
                }
            }
            localStorage.setItem("userlat", lat);
            localStorage.setItem("userlng", lng);
            localStorage.setItem("addressid", addid);
            getCartDataDetails($scope.itemlist, lat, lng);
            /*event.preventDefault();*/
            // $scope.setShippingAddress();
            $('#addressmodal').modal('hide');
            $("html, body").animate({
                scrollTop: 0
            }, "slow");

        }
      }
      else{
        $('#addressmodal').modal('hide');
         /*$.alert.open('Please Select Valid Address');*/
         $("#alertMsgText").html('');
         $("#alertMsgText").html('Please Select Valid Address');
         $("#alert-modal").modal('show');
      }
    }

    function updateItemInCart(cart_item) {
        // console.log(JSON.stringify(cart_item));
        ProductDetailService.addItemInCart(cart_item)
            .then(
                function successCallback(response) {},
                function error(response) {
                    console.log("Error Occoured");
                }
            );
    }




$scope.toggleAll = function() {

        // var wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
        var sum =0;
        var discount =0;
        var totaltax =0;
        var base_price = 0;
        var tax_able_amt = 0;
        var totalamt = 0;
        if ($("#isAllSelected").prop('checked') == true) {
            $(".child1").prop("checked", true);
        } else {
            $(".child1").prop("checked", false);
        }
        var selecteitem = [];
        var v = document.getElementsByName("selecteditem_checkbox");
        // alert(v.length);
            // alert(JSON.stringify(v));
            for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                    selecteitem.push(v[i].value);
                    // alert(JSON.stringify(selecteitem));
                }
                else{
                   selecteitem.push(0); 
                }
            }
            // alert($rootScope.cartdata.length);
            for(var j=0;j<$rootScope.cartdata.length;j++){
                if($rootScope.cartdata[j].id == selecteitem[j]){
                    var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
                    sum = sum+$rootScope.cartdata[j].price*quantity;
                    base_price = base_price + ($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)));
                    discount = discount + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100);
                    tax_able_amt = tax_able_amt + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*(1+($rootScope.cartdata[j].saleTaxPercentage/100));
                    totaltax = totaltax + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*$rootScope.cartdata[j].saleTaxPercentage/100;
                }
        }
        $("#sub_total").html(sum.toFixed(2));
        $("#total_discount").html(discount.toFixed(2));
        $("#total_tax").html(totaltax.toFixed(2));
        $("#total_amount").html(tax_able_amt.toFixed(2));
        $("#total_payableamt").html((Math.round(tax_able_amt)).toFixed(2));
    }


 $scope.toggleSingle = function() {
     // var wishListItems = JSON.parse(localStorage.getItem("wishListLocalStorage"));
     // alert(wishListItems.length);
     // console.log("$rootScope.cartdata" + JSON.stringify($rootScope.cartdata));
      var sum =0;
      var discount =0;
      var totaltax =0;
      var totalamt = 0;
      var base_price = 0;
      var count = 0;
      var tax_able_amt = 0;
     $scope.checked_count = 0;
     var v = document.getElementsByName("selecteditem_checkbox");
      // alert(v.length);
     for (var i = 0; i < v.length; i++) {
            var trid = v[i].id;
            // alert(trid);
            if ($("#" + trid).prop("checked") == true) {
                count++;
                $scope.checked_count = count;
                if($scope.checked_count == v.length) {
                   $("#isAllSelected").prop("checked", true);
                }
                else{
                   $("#isAllSelected").prop("checked", false);
                }
            } else { 
                 $("#isAllSelected").prop("checked", false);
            }
        }

        var selecteitem = [];
        var v = document.getElementsByName("selecteditem_checkbox");
            // alert(JSON.stringify(v));
            for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                    selecteitem.push(v[i].value);
                    // alert(JSON.stringify(selecteitem));
                }
                else{
                   selecteitem.push(0); 
                }
            }
            for(var j=0;j<$rootScope.cartdata.length;j++){
                if($rootScope.cartdata[j].id == selecteitem[j]){
                    var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
                    sum = sum+$rootScope.cartdata[j].price*quantity;
                    base_price = base_price + ($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)));
                    discount = discount + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100);
                    tax_able_amt = tax_able_amt + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*(1+($rootScope.cartdata[j].saleTaxPercentage/100));
                    totaltax = totaltax + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*$rootScope.cartdata[j].saleTaxPercentage/100;
                }
        }
        // tax_able_amt = base_price - discount;
        //     alert(tax_able_amt);
        $("#sub_total").html(sum.toFixed(2));
        $("#total_discount").html(discount.toFixed(2));
        $("#total_tax").html(totaltax.toFixed(2));
        $("#total_amount").html(tax_able_amt.toFixed(2));
        $("#total_payableamt").html((Math.round(tax_able_amt)).toFixed(2));
 }






$scope.goToCheckout = function() {
        if ($scope.statusCookie == 'Deactive') {
           /* $.alert.open('Please Log in');*/
           // $("#alertMsgText").html('');
           // $("#alertMsgText").html('Please Log in');
           // $("#alert-modal").modal('show');
           $('#login-window').modal("show");
        } else {
            var selecteitem = [];
            var checkoutitemlist = '';
            var coma = ',';
            var v = document.getElementsByName("selecteditem_checkbox");
            for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                    if(selecteitem.indexOf(v[i].value) === -1){
                       selecteitem.push(v[i].value);
                    // alert(JSON.stringify(selecteitem));
                    }          
                }
            }
            // alert(selecteitem.length);
            // alert(selecteitem)
            if (selecteitem.length != 0) {
                var sum =0;
                for(var j=0;j<$rootScope.cartdata.length;j++){
                if($rootScope.cartdata[j].id == selecteitem[j]){
                    var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
                    sum = sum+$rootScope.cartdata[j].price*quantity;
                   }
                 }
                 if(sum<200){
                     $("#purchase_200rs_modal").modal('show');
                 }
                 else{
                for (var j = 0; j < selecteitem.length; j++) {

                    if (checkoutitemlist == '') {
                        checkoutitemlist = selecteitem[j];
                    } else {
                        checkoutitemlist = checkoutitemlist + coma + selecteitem[j];
                    }

                }
                localStorage.setItem("selecteditemsforcheckout", checkoutitemlist);
                $location.path($rootScope.contextpath + "/checkout");
            }
            } else {
                /*$.alert.open('Please Select Item For Checkout');*/
                // $("#alertMsgText").html('');
                // $("#alertMsgText").html('Please Select Item For Checkout');
                // $("#alert-modal").modal('show');
                // $(".child").prop("checked", true);
                $("#isAllSelected").prop("checked", true);
                $(".child").prop("checked", true);
                // $("#isAllSelected").prop("checked", true);
                $scope.toggleAll();
                var selecteitem = [];
                $scope.not_selecteitem = [];
                var count_unselecteditem = 0;
                var v = document.getElementsByName("selecteditem_checkbox");
                 for (var i = 0; i < v.length; i++) {
                    if (v[i].checked) {
                        selecteitem.push(v[i].value);
                        // alert(JSON.stringify(selecteitem));
                        // count_unselecteditem++;
                    }
                    else{
                        $scope.not_selecteitem.push(v[i].value);
                    }
                }

                if($scope.not_selecteitem.length>0){
                    // console.log($scope.not_selecteitem);
                    var count = 0;
                    $scope.show_unavaiable_item1=[];
                    $scope.show_unavaiable_item=[];
                    $scope.show_unavaiable_item_obj={};
                    for(var l=0;l<$scope.not_selecteitem.length;l++){
                        for(var g=0;g<$rootScope.cartdata.length;g++){
                            if(parseInt($scope.not_selecteitem[l])==$rootScope.cartdata[g].id){
                                if($scope.show_unavaiable_item1.indexOf($rootScope.cartdata[g].name) === -1){
                                    $scope.show_unavaiable_item1.push($rootScope.cartdata[g].name);
                                    $scope.show_unavaiable_item.push($rootScope.cartdata[g]);
                                    $scope.show_unavaiable_item[count].quantity = $("#itmqnty_"+$rootScope.cartdata[g].id).val();
                                    count++;
                               }
                            }
                        }
                    }
                    $('#direct_purchse_modal').modal('show');
                    // console.log($scope.show_unavaiable_item);
                }


                // ......................................................
                else{
                // alert("asechi");
                var checkoutitemlist = '';
                var coma = ',';
                // var v = document.getElementsByName("selecteditem_checkbox");
                // alert(JSON.stringify(v));
                // for (var i = 0; i < v.length; i++) {
                //     if (v[i].checked) {
                //         selecteitem.push(v[i].value);
                //         alert(JSON.stringify(selecteitem));
                //     }
                // }
                var selecteitem_1=[];
                for(var n=0;n<selecteitem.length;n++){
                            if(selecteitem_1.indexOf(selecteitem[n]) === -1){
                                selecteitem_1.push(selecteitem[n]);
                            }
                    }
                if (selecteitem_1.length != 0) {    
                var sum =0;
                for(var j=0;j<$rootScope.cartdata.length;j++){
                if($rootScope.cartdata[j].id == selecteitem_1[j]){
                    var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
                    sum = sum+$rootScope.cartdata[j].price*quantity;
                   }
                 }
                 if(sum<200){
                     $("#purchase_200rs_modal").modal('show');
                 }
                 else{    
                for (var j = 0; j < selecteitem_1.length; j++) {

                    if (checkoutitemlist == '') {
                        checkoutitemlist = selecteitem_1[j];
                    } else {
                        checkoutitemlist = checkoutitemlist + coma + selecteitem_1[j];
                    }

                }
                    localStorage.setItem("selecteditemsforcheckout", checkoutitemlist);
                    $location.path($rootScope.contextpath + "/checkout");
                  }
                }

            }



             // ......................................................

            }
        }
    }



   $scope.direct_go_to_cart = function(par){
        if(par==1){
            $("#isAllSelected").prop("checked", true);
            $scope.toggleAll();
            var selecteitem = [];
            var checkoutitemlist = '';
            var coma = ',';
            var v = document.getElementsByName("selecteditem_checkbox");
            for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                    if(selecteitem.indexOf(v[i].value) === -1){
                       selecteitem.push(v[i].value);
                    }   
                }
            }
            if (selecteitem.length != 0) {
                for(var j=0;j<$rootScope.cartdata.length;j++){
                if($rootScope.cartdata[j].id == selecteitem[j]){
                    var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
                    sum = sum+$rootScope.cartdata[j].price*quantity;
                   }
                 }
                 if(sum<200){
                     $("#purchase_200rs_modal").modal('show');
                 }
                 else{
                for (var j = 0; j < selecteitem.length; j++) {

                    if (checkoutitemlist == '') {
                        checkoutitemlist = selecteitem[j];
                    } else {
                        checkoutitemlist = checkoutitemlist + coma + selecteitem[j];
                    }

                }
                localStorage.setItem("selecteditemsforcheckout", checkoutitemlist);
                $location.path($rootScope.contextpath + "/checkout");
               }
            }
        }
        else{
            $("#isAllSelected").prop("checked",false);
            $(".child").prop("checked", false);
        }
   }



$scope.getLatLng = function(pincode,type) {
        var zipcode=pincode;
       /* geocoder.geocode({ 'address': zipcode }, function (results, status) {
             if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();*/

        //set lat lng temporary 
        var latitude = '22.586408';
        var longitude = '88.400107';
           if(type==1){
             $scope.newaddress.latitude=latitude;
             $scope.newaddress.longitude=longitude;
           }
           if(type==2){
             $scope.selectedaddress.latitude=latitude;
             $scope.selectedaddress.longitude=longitude;
           }
           /* }
        });*/

    }

$scope.addAddress = function() {
    var tokenCookie = $cookies.get('Token');
     $scope.getLatLng($scope.newaddress.pincode,1);
    
    $http.post(serverurl+"/addresses",$scope.newaddress,{                 
      headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response:"+JSON.stringify(response.data));
         $scope.newaddress={};
         $scope.addressAddForm.$setPristine();
         $scope.addressAddForm.$setUntouched();
         getCustomerAddressData();
         $('#addressaddmodal').modal('hide');
        
       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users address');
           
       }
   );
   }




$scope.updateAddress = function() {
    var tokenCookie = $cookies.get('Token');
     $scope.getLatLng($scope.selectedaddress.pincode,2);
    // console.log("tokenCookie found:"+tokenCookie);
    // console.log("update address = "+ JSON.stringify($scope.selectedaddress));
     
     $http.post(serverurl+"/addresses",$scope.selectedaddress,{                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response:"+JSON.stringify(response.data));
         $scope.selectedaddress = response.data;
         $scope.newAddress={};
         $scope.addressEditForm.$setPristine();
         $scope.addressEditForm.$setUntouched();
         getCustomerAddressData();
         /*$scope.setShippingAddress();*/

         $('#addresseditmodal').modal('hide');
       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users address');
           
       }
   );
   }

$scope.change_itemqty = function(pid) {
        var newqty = $scope.itemQuantitydata[pid];
        $scope.isCheck = false;
        var currentqty = 0;
        
          if(newqty<1){
                $scope.crtMsg = "Please add at least one item.";
                $scope.itemQuantitydata[pid]=1;
                newqty=1;
               }

        for (var i = 0; i < $scope.cartItemTotalQtydata.length; i++) {
            if ($scope.cartItemTotalQtydata[i].id == pid) {
                currentqty = $scope.cartItemTotalQtydata[i].totalCurrentPackQty;
            }
        }

        var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        for (var i = 0; i < cart_items.length; i++) {
           if (cart_items[i].itemId == pid && newqty < currentqty) {
                $scope.isCheck = false;
                $scope.crtMsg = "";
                cart_items[i].packQty = newqty;
                if ($scope.statusCookie == 'Active') {
                    updateItemInCart(cart_items[i]);
                }
                localStorage.setItem("cartLocalStorage", JSON.stringify(cart_items));
                createParameterForCallCartData();
                $('#isAllSelected').prop('checked', false);
                get_cart_product_dup();
                break;
            } else {
                 $scope.itemQuantitydata[pid]=cart_items[i].packQty;
                $scope.crtMsg = "Can't increase quantity of this item.Please select quantity within stock.";
                $timeout(function() {
                    $scope.isCheck = true;
                }, 4000);
            }
         }
      
    }

$scope.makeDefault= function(id) {
    var tokenCookie = $cookies.get('Token');
  
   $http.post(serverurl+"/addresses/makedefault",{id},{                 
       headers:{'Authorization': tokenCookie}
          }).then(
       function (response) { },
       function(errResponse){}
    );
  }



  function callScratch(){
     var scContainer = document.getElementById('js--sc--container');
         var sc = new ScratchCard('#js--sc--container', {
            enabledPercentUpdate: true,
            scratchType: SCRATCH_TYPE.CIRCLE,
            brushSrc: 'bootstrap/img/brush.png',
            containerWidth: scContainer.offsetWidth,
            containerHeight: 300,
            imageForwardSrc: 'bootstrap/img/scratchcard.png',
            imageBackgroundSrc: '',
            htmlBackground: '<p class="test"><strong>Hello!!You get points !</strong></p>',
            clearZoneRadius: 30,
            percentToFinish: 80, // When the percent exceeds 50 on touchend event the callback will be exec.
            nPoints: 30,
            pointSize: 4,
            callback: function () {
              //alert('Now the window will reload !'); 
              $('#scratchcardmodal').modal('hide');
              
            }
          })
          sc.init();
          $rootScope.primaryNav='';
          $('#scratchcardmodal').modal('show');
          
}

$scope.viewItems = function(pid) {
        if (pid > 0) {
            // console.log("item clicked");
            window.localStorage.setItem('selecteditemid', pid);
            //$location.path( "/yewmed/product");
            $scope.selected_itemid_for_show = pid;
            // alert($scope.selected_itemid_for_show);
            $('#product-model').modal("show");
        }

    }



    $scope.hide_200rs_modal = function(){
        $("#purchase_200rs_modal").modal('hide');
    }


 
  // $scope.toggleAll();
  var cart_data_count=0; 
  $interval(function() {
    if($rootScope.cartdata.length>0){
        cart_data_count++;
    }

     if(cart_data_count<=1){
        if($(window).width()>=768){
            $("#isAllSelected").prop("checked", true);
            $(".child1").prop("checked", true);
        }
        else{
            // $("#isAllSelected").prop("checked", true);
            $(".child2").prop("checked", true);
        }
     }

     if(cart_data_count<=2){
        var sum =0;
        var discount =0;
        var totaltax =0;
        var base_price = 0;
        var tax_able_amt = 0;
        var totalamt = 0;
        var selecteitem = [];
        var v = document.getElementsByName("selecteditem_checkbox");
        // alert(v.length);
            // alert(JSON.stringify(v));
            for (var i = 0; i < v.length; i++) {
                if (v[i].checked) {
                    selecteitem.push(v[i].value);
                    // alert(JSON.stringify(selecteitem));
                }
                else{
                   selecteitem.push(0); 
                }
            }
            // alert($rootScope.cartdata.length);
            for(var j=0;j<$rootScope.cartdata.length;j++){
                if($rootScope.cartdata[j].id == selecteitem[j]){
                    var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
                    sum = sum+$rootScope.cartdata[j].price*quantity;
                    base_price = base_price + ($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)));
                    discount = discount + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100);
                    tax_able_amt = tax_able_amt + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*(1+($rootScope.cartdata[j].saleTaxPercentage/100));
                    totaltax = totaltax + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*$rootScope.cartdata[j].saleTaxPercentage/100;
                }
        }
        $("#sub_total").html(sum.toFixed(2));
        $("#total_discount").html(discount.toFixed(2));
        $("#total_tax").html(totaltax.toFixed(2));
        $("#total_amount").html(tax_able_amt.toFixed(2));
        $("#total_payableamt").html((Math.round(tax_able_amt)).toFixed(2));
     }
     
     // if(cart_data_count<=2){
     //    $scope.toggleAll();
     //  }
    }, 1000);
   

}]);



// var sum =0;
//         var discount =0;
//         var totaltax =0;
//         var base_price = 0;
//         var tax_able_amt = 0;
//         var totalamt = 0;
//         if ($("#isAllSelected").prop('checked') == true) {
//             $(".child1").prop("checked", true);
//         } else {
//             $(".child1").prop("checked", false);
//         }
//         var selecteitem = [];
//         var v = document.getElementsByName("selecteditem_checkbox");
//         // alert(v.length);
//             // alert(JSON.stringify(v));
//             for (var i = 0; i < v.length; i++) {
//                 if (v[i].checked) {
//                     selecteitem.push(v[i].value);
//                     // alert(JSON.stringify(selecteitem));
//                 }
//                 else{
//                    selecteitem.push(0); 
//                 }
//             }
//             // alert($rootScope.cartdata.length);
//             for(var j=0;j<$rootScope.cartdata.length;j++){
//                 if($rootScope.cartdata[j].id == selecteitem[j]){
//                     var quantity = $('#itmqnty_'+$rootScope.cartdata[j].id).val();
//                     sum = sum+$rootScope.cartdata[j].price*quantity;
//                     base_price = base_price + ($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)));
//                     discount = discount + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100);
//                     tax_able_amt = tax_able_amt + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*(1+($rootScope.cartdata[j].saleTaxPercentage/100));
//                     totaltax = totaltax + (($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100))) - ((($rootScope.cartdata[j].price*quantity / (1 + ($rootScope.cartdata[j].saleTaxPercentage / 100)))*$rootScope.cartdata[j].discount/100)))*$rootScope.cartdata[j].saleTaxPercentage/100;
//                 }
//         }
//         $("#sub_total").html(sum.toFixed(2));
//         $("#total_discount").html(discount.toFixed(2));
//         $("#total_tax").html(totaltax.toFixed(2));
//         $("#total_amount").html(tax_able_amt.toFixed(2));
//         $("#total_payableamt").html((Math.round(tax_able_amt)).toFixed(2));