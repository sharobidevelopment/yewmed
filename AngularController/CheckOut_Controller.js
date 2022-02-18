'use strict';
angular.module('myApp').controller('CheckOutController', ['$http', '$scope', '$rootScope', '$location', '$route' , 'CheckoutService', 'CartService', '$timeout', '$cookies','$routeParams', 'CommonService' , 'LoginService' , function($http, $scope, $rootScope, $location, $route , CheckoutService, CartService, $timeout, $cookies,$routeParams, CommonService, LoginService) {
    var self = this;
    $scope.cartdata = [];
    $scope.paymentmode = [];
    var membershipFeatureIds = [];
    $scope.filemsg = "";
    self.user = {email: '',password: ''};
    self.login = login;
    $scope.coma = ',';
    self.register={addresses:[]};
    self.userSubmit = userSubmit;
    $scope.prescriptionid = null;
    $scope.prescriptionids = [];
    $scope.shippingchargeflag = true;
    $scope.membershipdiscount = false;
    $scope.membership_shipping_discount_flag = false;
    $scope.membershippingdiscount = 0.0;
    self.register={addresses:[]};
    $scope.selectedaddress={};
    $scope.adress_update_chng = 0;
    $("#loader").hide();
    // alert(localStorage.getItem("defaultpincode"));

    var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var intRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;


    $("#regis_fname").val("jnjnjn");
    $("#regis_userName").val("");
    $("#regis_password").val("");
    $("#regis_pincode").val("");
    /*$scope.itemQuantitydata = [];
    $scope.itemDiscountAmtData = [];
    $scope.itemTaxAmtData = [];
    $scope.itemPricedata = [];*/
     callCountries();
    // alert("Hi");
    $scope.statusCookie = $cookies.get('Status');
    // alert($scope.statusCookie);
    $(".ng-not-empty").val("");


      $scope.updt_add_chng = function(){
          $scope.adress_update_chng = 1;
      }


    // if ($scope.statusCookie == 'Active') {
    //     var loggedinuserdata = JSON.parse(localStorage.getItem("loggedinuserdetails"));
    //     if (loggedinuserdata != null) {
    //         $scope.addressData = loggedinuserdata.addresses;
    //         console.log("Adreessss : " + JSON.stringify($scope.addressData));
    //     }
    // }




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
                     // console.log("cart data Hello:" +JSON.stringify(response));                    
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
        var tokenCookie = $cookies.get('Token');
        $http.get(serverurl+"/users/details",{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response Users:"+JSON.stringify(response.data))
         $scope.addressData = response.data.addresses;
         // console.log("Adreessss : " + JSON.stringify($scope.addressData));
       },
       function(errResponse){
          console.error("errResponse:"+'Error while fetching users details');
           
       }
     );
    }


    $scope.activememberpack = {};
    $scope.activememberfeatures = [];
    var orderBenefits1 =[];
   
    if (localStorage.getItem("activeplan") != null) {
        $scope.activememberpack = JSON.parse(localStorage.getItem("activeplan"));
        $scope.activememberfeatures = $scope.activememberpack.membershipFeatures;
    }
    getCartDataDetailsForCheckout();
    getPaymentDetails();
    if ($scope.statusCookie == 'Active') {
        getUserPoints();
    }

    function getCartDataDetailsForCheckout() { 
        // $http.get(serverurl + "/items/cartitemsdetails?itemIds=" + localStorage.getItem("selecteditemsforcheckout") + "&lat=" + localStorage.getItem("userlat") + "&lng=" + localStorage.getItem("userlng"))
        $http.get(serverurl + "/items/cartitemsdetails?itemIds=" + localStorage.getItem("selecteditemsforcheckout") + "&pin=" + localStorage.getItem("defaultpincode"))

            .then(
                function(response) {
                    // console.log("response data::" + JSON.stringify(response.data));
                    $scope.cartdata = response.data;
                    $scope.itemPricedata = [];
                    $scope.itemQuantitydata = [];
                    $scope.itemAvailabilityData = [];
                    $scope.itemBaseAmtData = [];
                    $scope.itemTaxAmtData = [];
                    $scope.itemDiscountAmtData = [];
                    $scope.itemtaxTypeIdData = [];
                    $scope.itemtaxIdData = [];
                    $scope.cartIdData = [];
                    $scope.itemNeedPrescription = [];

                    $scope.totaldiscountamt = 0.0;
                    $scope.totaltaxamt = 0.0;
                    $scope.totalamt = 0.0;
                    $scope.grossamt = 0.0;
                    $scope.roundoffamt = 0.0;
                    $scope.shipingchargeamt = 0.0;
                    $scope.roundedtotalamt = 0.0;
                    $scope.total_show_amount = 0;
                    var activeplan = JSON.parse(localStorage.getItem("activeplan"));

                    $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
                    // console.log("$scope.items data::" + JSON.stringify($scope.items));
                    for (var i = 0; i < $scope.cartdata.length; i++) {

                        if ($scope.cartdata[i].scheduleId == 13) {
                            $scope.itemNeedPrescription.push($scope.cartdata[i]);
                        }


                        for (var j = 0; j < $scope.items.length; j++) {
                            if ($scope.cartdata[i].id == $scope.items[j].itemId) {
                                $scope.discountamt = 0;
                                $scope.itemQuantity = $scope.items[j].packQty;
                                $scope.taxamt = 0;
                                $scope.discountamt = 0;
                                $scope.baseprice = 0;


                                // if ($scope.cartdata[i].taxTypeId == 1) { //Tax Inclusive
                                    $scope.total_show_amount = $scope.total_show_amount +  $scope.cartdata[i].price*$scope.itemQuantity;
                                    $scope.baseprice = ($scope.cartdata[i].price / (1 + ($scope.cartdata[i].saleTaxPercentage / 100)));
                                    if ($scope.cartdata[i].isDiscount == 1) {
                                        $scope.discountamt = parseFloat(($scope.baseprice * $scope.cartdata[i].discount / 100)).toFixed(2);
                                        $scope.taxableamt = ($scope.baseprice - $scope.discountamt);
                                    } else {
                                        $scope.taxableamt = $scope.baseprice;
                                    }
                                    $scope.taxamt = parseFloat($scope.itemQuantity * ($scope.taxableamt * $scope.cartdata[i].saleTaxPercentage / 100)).toFixed(2);
                                    $scope.actualPrice = parseFloat(($scope.itemQuantity * Number($scope.taxableamt)) + Number($scope.taxamt)).toFixed(2);
                                    $scope.grossamt = parseFloat(Number($scope.grossamt) + ($scope.itemQuantity * Number($scope.baseprice))).toFixed(2);
                                    $scope.discountamt = $scope.itemQuantity * $scope.discountamt;
                                // } else { Tax Exclusive
                                //     $scope.baseprice = $scope.cartdata[i].price;
                                //     if ($scope.cartdata[i].isDiscount == 1) {
                                //         $scope.discountamt = parseFloat(($scope.cartdata[i].price * $scope.cartdata[i].discount / 100)).toFixed(2);
                                //         $scope.taxableamt = ($scope.cartdata[i].price - $scope.discountamt);
                                //     } else {
                                //         $scope.taxableamt = $scope.cartdata[i].price;
                                //     }
                                //     $scope.taxamt = parseFloat($scope.itemQuantity * ($scope.taxableamt * $scope.cartdata[i].saleTaxPercentage / 100)).toFixed(2);
                                //     $scope.actualPrice = parseFloat(($scope.itemQuantity * Number($scope.taxableamt)) + Number($scope.taxamt)).toFixed(2);
                                //     $scope.grossamt = parseFloat(Number($scope.grossamt) + ($scope.itemQuantity * Number($scope.cartdata[i].price))).toFixed(2);
                                //     $scope.discountamt = $scope.itemQuantity * $scope.discountamt;
                                // }
 
                                $scope.totaldiscountamt = parseFloat(Number($scope.totaldiscountamt) + Number($scope.discountamt)).toFixed(2);
                                $scope.totaltaxamt = parseFloat(Number($scope.totaltaxamt) + Number($scope.taxamt)).toFixed(2);
                                $scope.totalamt = parseFloat(Number($scope.totalamt) + Number($scope.actualPrice)).toFixed(2);


                                /*$scope.itemPricedata[i]= $scope.actualPrice;*/
                                $scope.itemPricedata[$scope.cartdata[i].id] = $scope.actualPrice;
                                $scope.itemQuantitydata[$scope.cartdata[i].id] = $scope.itemQuantity;
                                $scope.itemTaxAmtData[$scope.cartdata[i].id] = $scope.taxamt;
                                $scope.itemDiscountAmtData[$scope.cartdata[i].id] = parseFloat($scope.discountamt).toFixed(2);
                                $scope.itemBaseAmtData[$scope.cartdata[i].id] = parseFloat($scope.baseprice).toFixed(2);
                                $scope.itemtaxTypeIdData[$scope.cartdata[i].id] = $scope.cartdata[i].taxTypeId;
                                $scope.itemtaxIdData[$scope.cartdata[i].id] = $scope.cartdata[i].saleTaxId;
                                $scope.cartIdData[$scope.cartdata[i].id] = $scope.items[j].id;



                                if ($scope.cartdata[i].totalCurrentPackQty != null) {
                                    if ($scope.items[j].packQty <= $scope.cartdata[i].totalCurrentPackQty) {
                                        $scope.itemAvailabilityData[$scope.cartdata[i].id] = 'Available';
                                    } else {
                                        $scope.itemAvailabilityData[$scope.cartdata[i].id] = 'Available Quantity ' + $scope.cartdata[i].totalCurrentPackQty;
                                    }
                                } else {
                                    $scope.itemAvailabilityData[$scope.cartdata[i].id] = 'Not Available';
                                }

                            }
                        }
                    }

                    if ($scope.totalamt < Number(500.00)) {
                        //$scope.shippingchargeflag = true;
                         // $scope.shipingchargeamt = parseFloat(50.00).toFixed(2);
                         $scope.shipingchargeamt = parseFloat(0.00).toFixed(2);
                    } else {
                        //$scope.shippingchargeflag = false;
                        $scope.shipingchargeamt = Number(0.00).toFixed(2);
                    }


                    // membership  offer calculation on shipping charge
                    if ($scope.shipingchargeamt != 0.00 && activeplan.membershipFeatures.length > 0) {
                        for (var j = 0; j < activeplan.membershipFeatures.length; j++) {
                            if (activeplan.membershipFeatures[j].activityId == 10) { // 10 is for shipping charge activity id
                                if ($scope.shipingchargeamt >= activeplan.membershipFeatures[j].minAmount && $scope.shipingchargeamt <= activeplan.membershipFeatures[j].maxAmount) {
                                    var shippingdiscount = (Number($scope.shipingchargeamt) * Number(activeplan.membershipFeatures[j].planAmount)) / 100;
                                    $scope.shipingchargeamt = Number($scope.shipingchargeamt) - Number(shippingdiscount);
                                    membershipFeatureIds.push(activeplan.membershipFeatures[j].id);
                                    $scope.membership_shipping_discount_flag = true;
                                    $scope.membershippingdiscount = activeplan.membershipFeatures[j].planAmount;

                                    var orderBenefits={};
                                    orderBenefits.activityId=activeplan.membershipFeatures[j].activityId;
                                    orderBenefits.membershipFeatureMapId=activeplan.membershipFeatures[j].id;
                                    orderBenefits.discPerc=activeplan.membershipFeatures[j].planAmount;
                                    orderBenefits.discAmount= parseFloat(shippingdiscount).toFixed(2);
                                    orderBenefits1.push(orderBenefits);

                                }
                            }
                        }
                    }

                    $scope.totalamt = parseFloat(Number($scope.totalamt) + Number($scope.shipingchargeamt)).toFixed(2);
                    $scope.roundedtotalamt = parseFloat(Math.round($scope.totalamt)).toFixed(2);
                    $scope.roundoffamt = parseFloat(Number($scope.totalamt) - Number($scope.roundedtotalamt)).toFixed(2);


                },
                function(errResponse) {

                }
            );
    }



    $scope.checkout = function() {
        //alert("hi"+$scope.prescriptionids);
         // alert("Hi");
         // alert($scope.selectedaddress.pincode);
        var checkout_items = localStorage.getItem("selecteditemsforcheckout");
        var splited_checkout_items = checkout_items.split(",");
        //var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        $scope.Order = {addressShipping:{}};

        var orderDetails = [];
        if (splited_checkout_items.length > 0) {
            for (var i = 0; i < splited_checkout_items.length; i++) {
                var orderitem = {};
                orderitem.itemId = splited_checkout_items[i];
                orderitem.cartId = document.getElementById('itmcartid_' + splited_checkout_items[i]).innerHTML;
                orderitem.packQty = document.getElementById('itmqnty_' + splited_checkout_items[i]).value;
                orderitem.saleRate = parseInt(document.getElementById('itmsalerate_' + splited_checkout_items[i]).innerHTML);
                orderitem.grossAmount = parseInt(document.getElementById('itmgrossprice_' + splited_checkout_items[i]).innerHTML);
                orderitem.discPer = document.getElementById('itmdiscper_' + splited_checkout_items[i]).innerHTML;
                orderitem.disc = document.getElementById('itmdiscamt_' + splited_checkout_items[i]).innerHTML;
                orderitem.taxId = document.getElementById('itmtaxid_' + splited_checkout_items[i]).innerHTML;
                orderitem.taxTypeId = document.getElementById('itmtaxtypeid_' + splited_checkout_items[i]).innerHTML;
                orderitem.taxPercentage = document.getElementById('itmtaxper_' + splited_checkout_items[i]).innerHTML;
                orderitem.taxAmount = document.getElementById('itmtaxamt_' + splited_checkout_items[i]).innerHTML;
                orderitem.netAmount = document.getElementById('itmprice_' + splited_checkout_items[i]).innerHTML;
                orderDetails.push(orderitem);

            }

        }

        // var addressid = localStorage.getItem("addressid");

        // if (addressid == null) {
        //     var loggedinuserdata = JSON.parse(localStorage.getItem("loggedinuserdetails"));
        //     var addressData = loggedinuserdata.addresses;
        //     for (var k = 0; k < addressData.length; k++) {
        //         if (addressData[k].isDefault == '1') {
        //             addressid = addressData[k].id;
        //         }
        //     }
        // }




        $http.get(serverurl+"/users/details",{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response Users:"+JSON.stringify(response.data))
         $scope.users=response.data;
         for(var i=0;i<response.data.addresses.length; i++){
             if(response.data.addresses[i].isDefault==1){
                $scope.Order.customerAddressId =  response.data.addresses[i].id;
                //Order.address =  response.data.addresses[i];

                $scope.Order.addressShipping.receiverName =  response.data.addresses[i].receiverName;
                $scope.Order.addressShipping.streetAddress =  response.data.addresses[i].streetAddress;
                $scope.Order.addressShipping.countryId =  response.data.addresses[i].country.id;
                $scope.Order.addressShipping.stateId =  response.data.addresses[i].state.id;
                $scope.Order.addressShipping.cityId =  response.data.addresses[i].city.id;
                $scope.Order.addressShipping.pincode =  response.data.addresses[i].pincode;
                $scope.Order.addressShipping.contactPhone =  response.data.addresses[i].contactPhone;
                $scope.Order.addressShipping.landmark =  response.data.addresses[i].landmark;

     // alert($scope.SelectedPaymentMode)
          

 

        $scope.Order.paymentMode = $scope.SelectedPaymentMode;
        // Order.customerAddressId = addressid;
        $scope.Order.grossAmount = parseInt(document.getElementById('cart_item_gross_amt').innerHTML);
        $scope.Order.discAmount = document.getElementById('cart_item_tot_discount').innerHTML;
        // Order.taxAmount = document.getElementById('cart_item_tot_tax');
        $scope.Order.taxAmount = $("#cart_item_tot_tax").val();
        // Order.netAmount = document.getElementById('cart_tot_amt_to_pay');
        $scope.Order.netAmount = $("#cart_tot_amt_to_pay").val();
        $scope.Order.roundoff = document.getElementById('cart_roundoff_amt').innerHTML;
        $scope.Order.totShippingCharge = document.getElementById('cart_item_shipping_charge').innerHTML;
        // Order.lat = localStorage.getItem("userlat");
        // Order.lng = localStorage.getItem("userlng");
        // Order.lat = '22.57139428';
        // Order.lng = '88.35056187';
        // Order.pinCode = 0;
        $scope.Order.pinCode = $scope.selectedaddress.pincode;
        $scope.Order.orderDetails = orderDetails;
        $scope.Order.prescriptionId = $scope.prescriptionid;
        $scope.Order.prescriptionIds = $scope.prescriptionids;


        $scope.Order.membershipFeatureIds = membershipFeatureIds;
        $scope.Order.orderBenefits = orderBenefits1;
        // console.log("new order : " + JSON.stringify(Order));

        CheckoutService.finalCheckOut($scope.Order)
            .then(
                function successCallback(response) {
                   // $.alert.open(response.message);
                    var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
                    var deletableitems = [];
                    if (splited_checkout_items.length > 0) {
                        for (var i = 0; i < cart_items.length; i++) {
                            for (var j = 0; j < splited_checkout_items.length; j++) {
                                // alert(cart_items[i].itemId + " " + splited_checkout_items[j]);
                                if (cart_items[i].itemId == splited_checkout_items[j]) {
                                    //alert("push:"+cart_items[i].itemId);
                                    deletableitems.push(cart_items[i]);
                                }
                            }
                        }
                        //alert(JSON.stringify(deletableitems));
                        for (var k = 0; k < deletableitems.length; k++) {
                            //alert("pop:"+JSON.stringify(deletableitems[k]));
                            const index = cart_items.indexOf(deletableitems[k]);
                            cart_items.splice(index, 1);
                            /*cart_items.pop(deletableitems[k]);*/
                        }




                        localStorage.setItem("cartLocalStorage", JSON.stringify(cart_items));
                        $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;
                        //alert("checkout:"+localStorage.getItem("cartLocalStorage"));
                        localStorage.removeItem("selecteditemsforcheckout");
                        localStorage.removeItem("addressid");
                        membershipFeatureIds = [];
                        orderBenefits1=[];
                        
                        getUserPoints();
                        $("#succMsgText").html('');
                        $("#succMsgText").html(response.message);
                        $("#myModalLabel1").hide();
                        $("#myModalLabel2").hide();
                        $("#modal_tick").hide();
                        if(response.status>0){
                            if($scope.SelectedPaymentMode==2){
                            $("#myModalLabel1").show();
                            $("#modal_tick").show();
                            $("#succ-modal").modal('show');
                            $timeout(function() {
                            $("#succ-modal").modal('hide');
                            $location.path($rootScope.contextpath + "/mycart");
                        }, 3000);
                          }
                          else{
                               //$location.path("http://localhost:8082/yewmed/payment.html");
                               // window.location.replace("http://localhost:8082/yewmed/payment.html");
                               // $scope.put_html = "<h1>Aniket Daw</h1>"
                               // localStorage.setItem("payment_html",$scope.put_html);
                               var tokenCookie = $cookies.get('Token');
                               //alert(tokenCookie);
                               $scope.Order.id=response.status;
                               // console.log(JSON.stringify($scope.Order));
                               // $http.post(serverurl+"/orders/pgRequest",$scope.Order,{
                               //  headers:{'Authorization': tokenCookie}
                               //    })
                               // .then(
                               // function (response) {
                                   
                               // },
                               // function(errResponse){
                               //    //console.error("errResponse:"+'Error while fetching users details');
                                   
                               //    }
                               //  );    





                                CheckoutService.paytmCheckout($scope.Order)
                               .then(
                               function successCallback(response) {
                                   
                                   console.log(response);
                                  localStorage.setItem("payment_html",response);
                                  //window.location.replace("http://localhost:8082/yewmed/payment.html");
                                 // window.location.replace("https://yewmedmart.in/yewmed_dup/payment.html");
                                 window.location.replace("https://yewmedmart.in/yewmed/payment.html");
                                },
                                function error(response) {
                                    console.log("Error Occoured");
                                   /* $.alert.open(response.data.message);*/
                                    // $("#alertMsgText").html('');
                                    // $("#alertMsgText").html(response.data.message);
                                    // $("#alert-modal").modal('show');
                                }
                            );






                          }
                        }
                        else{
                            $("#myModalLabel2").show();
                            $("#succ-modal").modal('show');
                            $timeout(function() {
                            $("#succ-modal").modal('hide');
                            $location.path($rootScope.contextpath + "/mycart");
                        }, 3000);
                        }
                        
                        
                        // $rootScope.primaryNav="successOrder";
                        // $location.path($rootScope.contextpath + "/ordersDetails");
                        // $location.path($rootScope.contextpath + "/mycart");
                         /*$routeParams.primaryNav="fromorder";*/
                        // $location.path($rootScope.contextpath + "/mycart/"+$routeParams.primaryNav);
                    }
                },
                function error(response) {
                    console.log("Error Occoured");
                   /* $.alert.open(response.data.message);*/
                    $("#alertMsgText").html('');
                    $("#alertMsgText").html(response.data.message);
                    $("#alert-modal").modal('show');
                }
            );

           // ...................Success function finished........................

            }
         }
       },
       function(errResponse){
          console.error("errResponse:"+'Error while fetching users details');
           
       }
   );


    }


   




    function getUserPoints() {

        CartService.callCustomerAddressData()
            .then(
                function successCallback(response) {
                    $rootScope.points = response.points;
                    localStorage.setItem("currentpoints", $rootScope.points);
                    //alert("points:"+ $rootScope.points);
                    checkCurrentActivePackage();
                },
                function error(response) {}
            );
    }


    function checkCurrentActivePackage() {
        if (localStorage.getItem("membershipdetails") != null) {
            var plans = JSON.parse(localStorage.getItem("membershipdetails"));
            for (var i = 1; i <= plans.length - 1; i++) {
                if ($rootScope.points >= plans[i - 1].pointMin && $rootScope.points <= plans[i].pointMin) {
                    localStorage.setItem("activeplanid", plans[i - 1].id);
                    localStorage.setItem("activeplan", JSON.stringify(plans[i - 1]));
                    $scope.class = '';
                    switch (plans[i - 1].name) {
                        case "Bronze":
                            $scope.class = "bronze";
                            break;
                        case "Silver":
                            $scope.class = "silver";
                            break;
                        case "Gold":
                            $scope.class = "gold";
                            break;
                        case "Platinum":
                            $scope.class = "platinum";
                            break;

                    }

                    $rootScope.activeclass = $scope.class;
                    //alert($rootScope.activeclass);


                }
            }
            if ($rootScope.points >= plans[plans.length - 1].pointMin) {
                localStorage.setItem("activeplanid", plans[plans.length - 1].id);
                localStorage.setItem("activeplan", JSON.stringify(plans[plans.length - 1]));
                $scope.class = "platinum";
                $rootScope.activeclass = $scope.class;
            }
            localStorage.setItem("currentactiveclass", $rootScope.activeclass);
        }

    }




    $scope.checkoutverification = function() {
        //alert($scope.SelectedPaymentMode);
        if ($scope.itemNeedPrescription.length > 0) {
            //$('#uploadprescriptionmodal').modal('show');
            /*$.alert.open('Please Upload Prescription');*/
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Please Upload Prescription');
            $("#alert-modal").modal('show');
        } else if ($scope.SelectedPaymentMode == undefined) {
            /*$.alert.open('Please Select PaymentMode');*/
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Please Select PaymentMode');
            $("#alert-modal").modal('show');
        } else {

            $scope.checkout();
        }
    }

    $scope.uploadPrescription = function() {
        var form_data = new FormData();
        var prescription = $scope.myFile;
        if (prescription != undefined) {
            $("#loader").show();
            $('#toggle_prescription_div').css('opacity', '0.3');
            $('#loader').css('opacity', '1');
            form_data.append('file', prescription);
            // console.log("new form_data" + JSON.stringify(form_data));
            CheckoutService.uploadPrescriptionFile(form_data)
            .then(
                function successCallback(response) {

                    if (response.status == 0) {
                            $scope.filemsg = response.message;
                    } else {
                        $scope.filemsg = response.message;
                        $scope.prescriptionid = response.status;
                        $scope.prescriptionids.push(response.status);
                        $scope.itemNeedPrescription = [];

                        $("#toggle_prescription_div").hide();
                        $("#nottoggle_payment_h3").hide();
                        $("#toggle_payment_h3").show();
                        $("#toggle_payment_div").show();
                        $("#loader").hide();
                        $('#toggle_prescription_div').css('opacity', '1');
                    }

                },
                function error(response) {
                    console.log("Error Occoured");
                }
            );
        }
        else{
            // $http.get(serverurl + "/items/cartitemsdetails?itemIds=" + localStorage.getItem("selecteditemsforcheckout") + "&lat=" + localStorage.getItem("userlat") + "&lng=" + localStorage.getItem("userlng"))
            $http.get(serverurl + "/items/cartitemsdetails?itemIds=" + localStorage.getItem("selecteditemsforcheckout") + "&pin=" + localStorage.getItem("defaultpincode"))

            .then(
                function(response) {
                    // console.log(response.data.length);
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].scheduleId == 13 || response.data[i].scheduleId == 1 || response.data[i].scheduleId == 7
                            || response.data[i].scheduleId == 8 || response.data[i].scheduleId == 10 ) {
                            $("#alertMsgText").html('');
                            $("#alertMsgText").html('Prescription needed');
                            $("#alert-modal").modal('show');
                        break;
                        }
                        else{
                            $("#toggle_prescription_div").hide();
                            $("#nottoggle_payment_h3").hide();
                            $("#toggle_payment_h3").show();
                            $("#toggle_payment_div").show();

                        }
                    }
                },
                function(errResponse) {

                }
            );
        }
        
    }



    $scope.get_payment_mode = function() {
        if ($("#rbPaymentMode_2").is(":checked")) {
            $scope.SelectedPaymentMode = 2;
            $("#toggle_payment_div").hide();
            $("#nottoggle_final_h3").hide();
            $("#toggle_final_h3").show();
            $("#toggle_final_div").show();
        }
        else if ($("#rbPaymentMode_1").is(":checked")) {
            $scope.SelectedPaymentMode = 1;
            $("#toggle_payment_div").hide();
            $("#nottoggle_final_h3").hide();
            $("#toggle_final_h3").show();
            $("#toggle_final_div").show();
        }
        else{
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Please select payment mode');
            $("#alert-modal").modal('show');
        }
    }



    function getPaymentDetails() {
        CheckoutService.paymentOptions()
            .then(
                function successCallback(response) {
                    $scope.paymentmode = response;
                },
                function error(response) {
                    console.log("Error Occoured");
                }
            );

    }


   $scope.setOfferValue = function(value,event,id) {
       if ($scope.memberOffer == event.target.value) $scope.memberOffer = false;
   
    if ($scope.SelectedPaymentMode == undefined) {
       /* $(".rdoMembershipOffers").removeAttr('checked');*/ 
        /*$.alert.open('Please Select PaymentMode');*/
        $("#rboffer_"+id).prop("checked", false);
        $("#alertMsgText").html('');
        $("#alertMsgText").html('Please Select Payment Mode');
        $("#alert-modal").modal('show');
    } else {
        var payModeName = '';
        for (var alpha = 0; alpha < $scope.paymentmode.length; alpha++) {
            if ($scope.paymentmode[alpha].id == $scope.SelectedPaymentMode) {
                payModeName = $scope.paymentmode[alpha].paymentMode;
                break;
            }
        }

        if (payModeName == 'cod' || payModeName == 'COD') {
            $(".rdoMembershipOffers").removeAttr('checked'); 
           /* $.alert.open('Offer Is Not Valid For COD Order');*/         
            $("#alertMsgText").html('');
            $("#rboffer_"+id).prop("checked", false);
            $("#alertMsgText").html('Offer Is Not Valid For COD Order');
            $("#alert-modal").modal('show');
        } else {
            var selectedOffer = JSON.parse(value);
            // console.log("value is:"+value);
            calculateOffer(selectedOffer);
        } 
    } 
} // function end


$scope.checkOfferSelected = function(paymentmode) {
    // alert(paymentmode);
    if(paymentmode == 'cod' || paymentmode == 'COD'){
      $(".rdoMembershipOffers").prop("checked", false);
       var selectedOffer = {};
       selectedOffer.activityId = 0;
       selectedOffer.planAmount=0;
       selectedOffer.factor = -1;
       calculateOffer(selectedOffer);
        // $("#alertMsgText").html('');
        // $("#alertMsgText").html('Offer Is Not Valid For COD Order');
        // $("#alert-modal").modal('show');

    }

}






function calculateOffer(selectedOffer){
            var activeplan = JSON.parse(localStorage.getItem("activeplan"));
             if(selectedOffer.activityId != 0){
                 membershipFeatureIds.push(selectedOffer.id);
               }else{
                membershipFeatureIds=[];
               }
            /*console.log(JSON.stringify($scope.cartdata));*/
            /*console.log(localStorage.getItem("activeplan"));*/
            var checkoutitems = $scope.cartdata;
            var totaldiscountamt = 0.0;
            var totaltaxamt = 0.0;
            var totalamt = 0.0;
            var grossamt = 0.0;
            var shipingchargeamt = 0.0;

            // offer calculation
            var currentDiscount = $scope.totaldiscountamt;
            if (selectedOffer.factor == -1) { // subtract operation  
                for (var i = 0; i < checkoutitems.length; i++) {
                    if(selectedOffer.activityId != 0){
                          $scope.membershipdiscount = true;
                     }else{
                          $scope.membershipdiscount = false;
                    }
                    /*$scope.membershipdiscount = true;*/

                    // if (checkoutitems[i].taxTypeId == 1) { //Tax Inclusive
                        var baseprice = (checkoutitems[i].price / (1 + (checkoutitems[i].saleTaxPercentage / 100)));
                        if (checkoutitems[i].isDiscount == 1) {
                            var discountamt = parseFloat((baseprice * (Number(checkoutitems[i].discount) + Number(selectedOffer.planAmount)) / 100)).toFixed(2);
                            var taxableamt = (Number(baseprice) - Number(discountamt));
                        } else {
                            var discountamt = parseFloat((baseprice * Number(selectedOffer.planAmount) / 100)).toFixed(2);
                            var taxableamt = (Number(baseprice) - Number(discountamt));

                        }
                        var taxamt = parseFloat($scope.itemQuantitydata[checkoutitems[i].id] * (taxableamt * checkoutitems[i].saleTaxPercentage / 100)).toFixed(2);
                        var actualPrice = parseFloat(($scope.itemQuantitydata[checkoutitems[i].id] * Number(taxableamt)) + Number(taxamt)).toFixed(2);
                        grossamt = parseFloat(Number(grossamt) + ($scope.itemQuantitydata[checkoutitems[i].id] * Number(baseprice))).toFixed(2);
                        var discountamt = $scope.itemQuantitydata[checkoutitems[i].id] * discountamt;

                    // } else { Tax Exclusive
                    //     var baseprice = checkoutitems[i].price;
                    //     if (checkoutitems[i].isDiscount == 1) {
                    //         var discountamt = parseFloat((checkoutitems[i].price * (Number(checkoutitems[i].discount) + Number(selectedOffer.planAmount)) / 100)).toFixed(2);
                    //         var taxableamt = (Number(baseprice) - Number(discountamt));
                    //     } else {
                    //         var discountamt = parseFloat((checkoutitems[i].price * Number(selectedOffer.planAmount)) / 100).toFixed(2);
                    //         var taxableamt = (Number(baseprice) - Number(discountamt));

                    //     }
                    //     var taxamt = parseFloat($scope.itemQuantitydata[checkoutitems[i].id] * (taxableamt * checkoutitems[i].saleTaxPercentage / 100)).toFixed(2);
                    //     var actualPrice = parseFloat(($scope.itemQuantitydata[checkoutitems[i].id] * Number(taxableamt)) + Number(taxamt)).toFixed(2);
                    //     grossamt = parseFloat(Number(grossamt) + ($scope.itemQuantitydata[checkoutitems[i].id] * Number(baseprice))).toFixed(2);
                    //     var discountamt = $scope.itemQuantitydata[checkoutitems[i].id] * discountamt;
                    // }


                    totaldiscountamt = parseFloat(Number(totaldiscountamt) + Number(discountamt)).toFixed(2);
                    totaltaxamt = parseFloat(Number(totaltaxamt) + Number(taxamt)).toFixed(2);
                    totalamt = parseFloat(Number(totalamt) + Number(actualPrice)).toFixed(2);

                    $scope.itemPricedata[checkoutitems[i].id] = actualPrice;
                    $scope.itemTaxAmtData[checkoutitems[i].id] = taxamt;
                    $scope.itemDiscountAmtData[checkoutitems[i].id] = parseFloat(discountamt).toFixed(2);

                    if (checkoutitems[i].isDiscount == 1) {
                        $("#itmdiscper_" + checkoutitems[i].id).html(parseFloat(Number(checkoutitems[i].discount) + Number(selectedOffer.planAmount)).toFixed(2));
                    } else {
                        $("#itmdiscper_" + checkoutitems[i].id).html(parseFloat(selectedOffer.planAmount).toFixed(2));
                    }
                    $("#itmdiscamt_" + checkoutitems[i].id).html(parseFloat(discountamt).toFixed(2));
                    $("#itmtaxamt_" + checkoutitems[i].id).html(parseFloat(taxamt).toFixed(2));
                    $("#itmprice_" + checkoutitems[i].id).html(parseFloat(actualPrice).toFixed(2));
                    $("#itmgrossprice_" + checkoutitems[i].id).html(parseFloat(baseprice).toFixed(2));




                } // end for


                $scope.grossamt = parseFloat(grossamt).toFixed(2);
                $scope.totaldiscountamt = parseFloat(totaldiscountamt).toFixed(2);
                $scope.totaltaxamt = parseFloat(totaltaxamt).toFixed(2);

                totalamt = parseFloat(Number(totalamt) + Number($scope.shipingchargeamt)).toFixed(2);
                $scope.roundedtotalamt = parseFloat(Math.round(totalamt)).toFixed(2);
                $scope.roundoffamt = parseFloat(Number(totalamt) - Number($scope.roundedtotalamt)).toFixed(2);
                $scope.shipingchargeamt = parseFloat($scope.shipingchargeamt).toFixed(2);


                if(selectedOffer.activityId != 0){
                    var orderBenefits = {};
                    orderBenefits.activityId = selectedOffer.activityId;
                    orderBenefits.membershipFeatureMapId = selectedOffer.id;
                    orderBenefits.discPerc = selectedOffer.planAmount;
                    orderBenefits.discAmount = parseFloat(Number(totaldiscountamt) - Number(currentDiscount)).toFixed(2);
                    orderBenefits1.push(orderBenefits);
               }else{
                     orderBenefits1 = [];

               }

            }
}






function callCountries() {
   CommonService.getCountryList()
            .then(
                function successCallback(response) {
                  $scope.countries=response;
                  // alert(JSON.stringify($scope.countries));
                },
                function error(response) {
                    console.log("Error Occoured In Fetching Countries");
                }
            );
    }    


  $scope.getStates = function() {
   // alert("Hi");
   //alert("getStates: "+self.register.addresses[0].countryId);
   $scope.adress_update_chng = 1;
    $http.get(serverurl+"/addresses/countries/"+$scope.selectedaddress.countryId+"/states")
       .then(
       function (response) {
        // alert("response"+response.data);
         // console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.states=response.data;
       },
       function(errResponse){
          //alert("errResponse"+response.data);
          $scope.states=response.data;
        console.error("errResponse:"+'Error while fetching states.');
       }
   );
};


$scope.getCities= function() {
   //alert("getStates1: "+self.register.addresses[0].stateId);
   $scope.adress_update_chng = 1;
    $http.get(serverurl+"/addresses/states/"+$scope.selectedaddress.stateId+"/cities")
       .then(
       function (response) {
           //alert("response"+$scope.cities);
         // console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.cities=response.data;
       },
       function(errResponse){
           //alert("errResponse"+response.data);
        console.error("errResponse:"+'Error while fetching cities.');
       }
    );
 }



 $scope.getUser= function() {
    var tokenCookie = $cookies.get('Token');
    // console.log("tokenCookie found:"+tokenCookie);

     $http.get(serverurl+"/users/details",{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response Users:"+JSON.stringify(response.data))
         $scope.users=response.data;
         for(var i=0;i<response.data.addresses.length; i++){
             if(response.data.addresses[i].isDefault==1){
                $scope.selectedaddress =  response.data.addresses[i];
                $http.get(serverurl+"/addresses/countries/"+$scope.selectedaddress.countryId+"/states")
                   .then(
                   function (response) {
                    // alert("response"+response.data);
                     // console.log("response:"+JSON.stringify(response.data))
                     //self.products=response.data;
                     $scope.states=response.data;
                   },
                   function(errResponse){
                      //alert("errResponse"+response.data);
                      $scope.states=response.data;
                    console.error("errResponse:"+'Error while fetching states.');
                   }
               );

               $http.get(serverurl+"/addresses/states/"+$scope.selectedaddress.stateId+"/cities")
       .then(
       function (response) {
           //alert("response"+$scope.cities);
         // console.log("response city:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.cities=response.data;
       },
       function(errResponse){
           //alert("errResponse"+response.data);
        console.error("errResponse:"+'Error while fetching cities.');
       }
    );

             }
         }
       },
       function(errResponse){
          console.error("errResponse:"+'Error while fetching users details');
           
          }
      );

 }



 $scope.updateAddress = function() {
  // alert("updateAddress: "+$scope.selectedaddress);
   var loggedinuserdata = JSON.stringify(localStorage.getItem("loggedinuserdetails"));
    // console.log("loggedinuserdata : " + loggedinuserdata);
  var pincode1 = $("#adress_pincode").val();
  var id1= $("#adress_id").val();
  $scope.selectedaddress.pincode = pincode1;
  $scope.selectedaddress.id = id1;
  $scope.selectedaddress.isDefault = 1;
    var tokenCookie = $cookies.get('Token');
    // console.log("tokenCookie found:"+tokenCookie);
    // console.log("update address = "+ JSON.stringify($scope.selectedaddress));
    if($scope.adress_update_chng == 0){
        $("#checkout_address").hide();
         $("#nottoggle_prescription_h3").hide();
         $("#toggle_prescription_h3").show();
         $("#toggle_prescription_div").show();
         $scope.adress_update_chng = 0;
    }
    else{
     $http.post(serverurl+"/addresses",$scope.selectedaddress,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response:"+JSON.stringify(response.data));
         $scope.selectedaddress = response.data;
         // $scope.newAddress={};
         // $scope.addressForm.$setPristine();
         // $scope.addressForm.$setUntouched();
         // $('#addresseditmodal').modal('hide');
         // $scope.getUser();
         $("#checkout_address").hide();
         $("#nottoggle_prescription_h3").hide();
         $("#toggle_prescription_h3").show();
         $("#toggle_prescription_div").show();
         $scope.adress_update_chng = 0;


       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users updateAddress');
       }
     );
    }
}



   // ............................login & Register Function..............................


   function login() {
       self.user.loginType='USER';
       // console.log(self.user);
        LoginService.loginRequest(self.user)
            .then(
                function successCallback(response) {
                  // console.log(response.data);
                     $scope.msg = "";
                    $cookies.put('Token', response.headers('Authorization'));
                    $cookies.put('Status', 'Active');
                    $rootScope.statusCookie = 'Active';
                    //var tokenCookie = $cookies.get('Token');
                    $('#login-window').modal("hide");
                    //$("#login-window").hide();
                   
                    /*var latitude = '22.57139428';
                    var longitude = '88.35056187';
                    localStorage.setItem("userlat", latitude);
                    localStorage.setItem("userlng", longitude);*/
                    getUserDetails(); // call for geting login user data with address
                    getWishList();
                    $route.reload();
                    callCart();
                },
                function error(response) {
                    /*$scope.msg = "Server closed";*/
                      $scope.msg = "Sorry you provided wrong Password or Emailid.";

                }
                /*function(errResponse){
                    console.error('Error while creating User');
                }*/
            );
    }



    function  getWishList(){
     var tokenCookie = $cookies.get('Token');
     $http.get(serverurl+"/cart/wishlist",{        
            headers:{'Authorization': tokenCookie}
                }).then(
            function(response) {
               localStorage.setItem("wishListLocalStorage", JSON.stringify(response.data));
               $rootScope.totalitemsinwishlist=response.data.length;
             },
            function(errResponse) {}
            );
  }



  function callCart() {
        $scope.itemlist = "";
        LoginService.callCartData()
            .then(
                function successCallback(response) {
                    localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                    // console.log("cart data :: ", JSON.stringify(response))
                    $rootScope.totalitemsincart = response.length;
                    $rootScope.cart_personal_data = response;
                    if (response.length > 0){
                        for ($scope.i = 0; $scope.i < response.length; $scope.i++) {
                            if ($scope.itemlist == "") {
                                $scope.itemlist = response[$scope.i].itemId;
                                getCartDataDetails($scope.itemlist);
                            } else {
                                $scope.itemlist = $scope.itemlist + $scope.coma + response[$scope.i].itemId;
                                getCartDataDetails($scope.itemlist);
                            }
                        }
                    }
                    // console.log("cart data from checkout page :" + JSON.stringify(response));
                    if ($location.absUrl().split('/').pop() == "register") {
                                        $location.path($rootScope.contextpath1);
                                      }  
                    $route.reload();
                },
                function error(response) {
                    $scope.msg = "Invalid login credentials";
                }

            );
    }


    function getCartDataDetails(idlist) {

      // $("#loader").show();
        
           $http.get(serverurl+"/items/itemsdetailsbyids?itemIds=" + idlist)
            // $http.get(serverurl+"/items/cartitemsdetails?itemIds="+idlist+"&lat="+lat+"&lng="+lng)           
             .then(
                function(response) {
                    //$("#loader").hide();
                   /* $("#emptymsg").show();*/
                    // console.log("cart data details from checkout page::" + JSON.stringify(response.data));
                    $rootScope.cartdata = response.data;
                    // alert($rootScope.cart_personal_data);
                    for(var i=0; i<$rootScope.cartdata.length; i++){
                        for(var j=0; j<$rootScope.cart_personal_data.length; j++){
                            if($rootScope.cartdata[i].id == $rootScope.cart_personal_data[j].id){
                                $rootScope.cartdata[i].quanntity = $rootScope.cart_personal_data[j].packQty;
                            }
                            else{
                                
                            }
                        }
                    }
                },
                function(errResponse) {}
            );
    }


    function  getUserDetails(){
        CartService.callCustomerAddressData()
            .then(
                function successCallback(response) {
                    // console.log("Address::"+JSON.stringify(response));
                    localStorage.setItem("loggedinuserdetails", JSON.stringify(response));
                    $rootScope.activeusername=response.fname;
                    $rootScope.points=response.points;
                    localStorage.setItem("currentpoints", $rootScope.points);
                    for(var i=0;i<response.addresses.length;i++){
                        if(response.addresses[i].isDefault==1){
                           localStorage.setItem("userlat", response.addresses[i].latitude);
                           localStorage.setItem("userlng", response.addresses[i].longitude);
                        }
                    }

                     // if(localStorage.getItem("membershipdetails") == null ){
                     //     getAllPlans();
                     //    }
                     //  if(localStorage.getItem("membershipfeatures") == null ){
                     //       getFeatures();
                     //   }
                     // getActivePlanId();
                     $route.reload();
                },
                function error(response) {
                    
                }

            );
        }



function submit_registerform() {
    // console.log('Register User', self.register);
            // self.register.addresses[0].latitude = '22.58139428';
            // self.register.addresses[0].longitude = '88.36056187';
       
        LoginService.userRequest(self.register)
             .then(
             function successCallback(response) {
                 // console.log('User created successfully');
                 //var successMessage = 'User created successfully';
                 $("#username_error_check1").text("");
                 self.errorMessage ='';
                 // console.log('Register User', response);
                 if(response.data.status == 0) {
                    // alert("User already exist");
                    $("#username_error_check1").text(response.data.message);
                 }
                 else {
                    //alert("successfully submitted");
                    $('#register-window').modal("hide");
                    $location.path( $rootScope.contextpath1 );
                 }
                 //$("#login").show();
                 // alert($scope.email_check_status);
                  // if($scope.email_check_status == 0) {
                  //    alert("Email id is alreday exist");
                  //    $("#error_email_show").html('<div class="alert alert-danger" role="alert">Email id is alreday exist </div>');
                  // }
                  //  else{
                  //  $location.path( "/yewmed/" );
                  //  $location.path( "/yewmed/register" );
                  //  }
            },  
             function error(response) {
             console.error('Error while creating User');
             // self.errorMessage = 'Error while creating User: ' + response.data.message;
             self.errorMessage =  response.data.message;
             if(response.data.message = '') {
                self.errorMessage = '';
             }
             // alert(response.data.message);
             self.successMessage='';
             /*$scope.msg="Please provide valid details";*/
                    
              }
              
             /*function(errResponse){
                 console.error('Error while creating User');
             }*/
         );
  }




function userSubmit(){
    // alert("Hello");
   $("#username_error_check1").text("");
  var register_userName = $("#regis_userName").val();
  // alert(register_userName);

    if(intRegex.test(register_userName)) {
             var valid_phoneno = register_userName;
             if(valid_phoneno.length<10){
                $("#username_error_check1").text("Please enter valid phone no");
                alert("Please enter correct phone no");
             }
            else {
                self.register.phone = self.register.userName;
                self.register.addresses[0].contactPhone = self.register.userName;
                submit_registerform();
             }
       }
    else if (emailReg.test(register_userName)) {
           self.register.email = self.register.userName;
           submit_registerform();
      }
      else if (!intRegex.test(register_userName) || !emailReg.test(register_userName)) {
         $("#username_error_check1").text("Please enter email id or phone no");
       }
      else {
        // console.log('Register User', JSON.stringify(self.register));
        // console.log('Register User', self.register);
       
        LoginService.userRequest(self.register)
             .then(
             function successCallback(response) {
                 // console.log('User created successfully');
                 self.errorMessage ='';
                 // console.log('Register User', response);
                 $("#usercreated").text(response.data.message);
                  if($scope.email_check_status == 0) {
                     $("#error_email_show").html('<div class="alert alert-danger" role="alert">Email id is alreday exist </div>');
                  }
                   else{
                   $location.path( $rootScope.contextpath1 );
                   }
            },  
             function error(response) {
             console.error('Error while creating User');
             self.errorMessage =  response.data.message;
             if(response.data.message = '') {
                self.errorMessage = '';
             }
             self.successMessage='';      
              }
         );
     }

     }



$scope.toggleShowPassword = function() {
    $scope.showPassword = !$scope.showPassword;
  }   
  
$scope.toggleShowPassword1 = function() {
    $scope.showPassword1 = !$scope.showPassword1;
  }          



 $scope.getUser();


}]);