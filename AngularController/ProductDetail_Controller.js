/**
 * 
 */
'use strict';
angular.module('myApp').controller('ProductDetailsController', ['$route', '$location', '$http', '$scope', '$cookies', 'ProductDetailService', '$rootScope', '$timeout' , 'LoginService', '$routeParams' , function($route, $location, $http, $scope, $cookies, ProductDetailService, $rootScope, $timeout, LoginService, $routeParams) {
    var self = this;
    $scope.customer_selected_qty = 1;
    self.product = {};
    $scope.product = {};
    $scope.coma = ",";
    var itemcurrentstock = 0;
    get_cart_product_dup();
    $("#succes_add_cart").html('');
    $scope.relatedProducts = [];
    $scope.statusCookie = $cookies.get('Status');
    $scope.availablepincode = [700131,700054,700101,700124,721401,742159,700091,700067,700121,700048,743222,700107,721155,743704,712404,711414,721140];
    $scope.availablepincode_for_corona = [721401];
    // $scope.grp_name = window.localStorage.getItem("grpname");
    // $scope.cate_name = window.localStorage.getItem("catename");

    //var selecteditemid = window.localStorage.getItem('selecteditemid');
    var selecteditemid = $routeParams.metatag.split("-")[0];
    getSelectedProductDetails();
    

    // alert($scope.statusCookie);
    if ($scope.statusCookie === undefined) {
        $scope.statusCookie = 'Deactive';
    }

     var tokenCookie = $cookies.get('Token');
     if(tokenCookie != '') {
        
         $http.get(serverurl+"/users/details",{
                     headers:{'Authorization': tokenCookie}
              })
           .then(
           function (response) {
             //console.log("response:"+JSON.stringify(response.data))
             $scope.users=response.data;
             //console.log("$scope.users : " + JSON.stringify($scope.users));

             if($scope.users.addresses.length == 0){
                var default_zipcode = $("#customer_zip_code").val();
                // alert("default zip code:" + default_zipcode);
             }

             else {
             
             for(var x=0; x<$scope.users.addresses.length; x++){
                    if($scope.users.addresses[x].isDefault == 1){
                        var defaultaddfind = x;
                    }
                }
               var default_zipcode = $scope.users.addresses[defaultaddfind].pincode;
               // alert(default_zipcode)
               // console.log($scope.users.addresses[defaultaddfind].latitude);
               // console.log($scope.users.addresses[defaultaddfind].longitude);
               // console.log(selecteditemid);
               getSelectedAddressDetails1(selecteditemid, default_zipcode);
               $("#customer_zip_code").attr('value',default_zipcode);

               $('#checkButton').prop('disabled', false);
           }
           },
           function(errResponse){
              //console.error("errResponse:"+'Error while fetching users details');
               
              }
            );       
        }


// alert($scope.statusCookie);

    


    // alert("Hi");
    $(".ng-not-empty").val("");




   // ............................new code...............................

    var cart_items_dup = localStorage.getItem("cartLocalStorage");

    function get_cart_product_dup(){
    if($rootScope.statusCookie != "Active"){
          $rootScope.cartdata_dup = JSON.parse(localStorage.getItem("cartLocalStorage"));
          if ($rootScope.cartdata_dup !== null){
      }
    }else if($rootScope.statusCookie == "Active") {
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
    else {

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




    function getSelectedProductDetails() {
        ProductDetailService.selectedProductDetailsRequest(selecteditemid)
            .then(
                function successCallback(response) {
                    // console.log("viewItems Details:" + JSON.stringify(response.data));
                    $scope.product = response.data;
                    $scope.grp_name = response.data.group;
                    $scope.cate_name = response.data.category;
                    $scope.grp_id = response.data.groupId;
                    $scope.cate_id = response.data.categoryId;
                    document.title = response.data.metaTag; 
                    $scope.calculateSelectedProductPrice();
                     $http.get(serverurl+"/items/sideeffect/content/"+response.data.contentId)            
                       .then(
                            function(response) {
                                $scope.medicineDescription = response.data;
                                // console.log("$scope.medicineDescription : " + JSON.stringify($scope.medicineDescription));
                                if($scope.medicineDescription.length>0){
                                    $scope.first_desp_id= $scope.medicineDescription[0].id;
                                }
                            },
                            function(errResponse) {}
                        );

                    getRelatedProducts($scope.product.contentId, $scope.product.strength, $scope.product.groupId)
                },
                function error(response) {}
            );
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;

    }

    $scope.$on('ngRepeatFinished1', function(ngRepeatFinishedEvent) {
        $(".product_description_div").hide();
        $("#desc_"+$scope.first_desp_id).show();
        $("#desc_span_"+$scope.first_desp_id).addClass("product_description_span_active");
    });

    $scope.show_description_div = function(id){
        $("button").removeClass("product_description_span_active");
        $(".product_description_div").hide();
        $("#desc_"+id).show();
        $("#desc_span_"+id).addClass("product_description_span_active");
    }

    function getSelectedAddressDetails(productid, latitude, longitude) {
        ProductDetailService.checkSalabilityByItem(productid, latitude, longitude)
            .then(
                function successCallback(response) {
                    //console.log("response Details:" + JSON.stringify(response.data));
                    $scope.msg = response.data.message;
                    

                    if (response.data.status > 0) {
                        itemcurrentstock = response.data.status;
                        localStorage.setItem("userlat", latitude);
                        localStorage.setItem("userlng", longitude);

                        $('#addToCart').prop('disabled', false);
                        // $("#msg_for_avl").text(response.data.message);
                        $("#msg_for_avl").html('<i class="fa fa-check" aria-hidden="true" style="color:green"></i> <span style="color:green"> In Stock </span>');
                        // $timeout(function() {
                        //     $("#msg_for_avl").text('');
                        // }, 5000);
                    }
                    else {
                        // $("#msg_for_not_avl").text(response.data.message);
                        $("#msg_for_not_avl").text("Out of stock at your location");
                        // $timeout(function() {
                        //     $("#msg_for_not_avl").text('');
                        // }, 5000);
                    }
                },
                function error(response) {
                    //$("#msg_for_not_avl").text("Sorry! We cannot Deliver this item at your location");
                    $("#msg_for_not_avl").text("Out of stock at your location");
                        $timeout(function() {
                            $("#msg_for_not_avl").text('');
                        }, 5000);
                }
            );
    }


    // function getSelectedAddressDetails1(productid, latitude, longitude) {
    //     ProductDetailService.checkSalabilityByItem(productid, latitude, longitude)
    //         .then(
    //             function successCallback(response) {
    //                 //console.log("response Details:" + JSON.stringify(response.data));
    //                 $scope.msg = response.data.message;
                    

    //                 if (response.data.status > 0) {
    //                     itemcurrentstock = response.data.status;
    //                     localStorage.setItem("userlat", latitude);
    //                     localStorage.setItem("userlng", longitude);

    //                     $('#addToCart').prop('disabled', false);
    //                     $("#add_to_cart_active").html('<i class="fa fa-check" aria-hidden="true" style="color:green"></i> <span style="color:green"> In Stock </span>');
    //                 }
    //                 else {
    //                     $("#add_to_cart_not_active").text("Out of stock at your location");
    //                 }
    //             },
    //             function error(response) {
    //                 $("#add_to_cart_not_active").text("Out of stock at your location");
    //             }
    //         );
    // }



    // ....................................new code for pincode check................................................



    self.checkSalabilityByPincode = function(productid,groupid,customerzipcode) {
         //alert("check pincode");
         //alert(groupid);
        $("#not_active_false_p").hide();
        $("#add_to_cart_active").text("");
        $("#add_to_cart_not_active").text("");
        $("#msg_for_avl").text("");
        $("#msg_for_not_avl").text("");

       // var latitude = '22.586408';
       // var longitude = '88.400107';

       $scope.customer_zip_code = parseInt($("#customer_zip_code").val());
       // alert($scope.customer_zip_code);

       if($scope.customer_zip_code.length<6){
            $("#msg_for_not_avl").text("Please provide valid pincode");
            $('#addToCart').prop('disabled', true);
       }
       else{ 
           if(groupid == 133){
              var check_pincode = $scope.availablepincode_for_corona.indexOf($scope.customer_zip_code);
           }
           else{
              var check_pincode = $scope.availablepincode.indexOf($scope.customer_zip_code);
           }
           if(check_pincode == -1){
                $("#msg_for_not_avl").text("Out of stock at your location");
                $('#addToCart').prop('disabled', true);
           }
           else{
           ProductDetailService.checkSalabilityByItemandPincode(productid, $scope.customer_zip_code)
            .then(
                function successCallback(response) {
                    $scope.msg = response.data.message;
                    $('#addToCart').prop('disabled', false);
                    $("#msg_for_avl").html('<i class="fa fa-check" aria-hidden="true" style="color:green"></i> <span style="color:green"> In Stock </span>');
                    itemcurrentstock = response.data.status;
                     
                    //  if(response.data.message == 'InvalidPinCode'){
                    //        $("#msg_for_not_avl").text("Please provide valid pincode");
                    //  }

                    // else if (response.data.status > 0) {
                    //     itemcurrentstock = response.data.status;
                    //     // localStorage.setItem("userlat", latitude);
                    //     // localStorage.setItem("userlng", longitude);

                    //     $('#addToCart').prop('disabled', false);
                    //     $("#msg_for_avl").html('<i class="fa fa-check" aria-hidden="true" style="color:green"></i> <span style="color:green"> In Stock </span>');
                    // }
                    // else {
                    //     $("#msg_for_not_avl").text("Out of stock at your location");
                    //     $('#addToCart').prop('disabled', true);
                    // }
                },
                function error(response) {
                    //$("#msg_for_not_avl").text("Sorry! We cannot Deliver this item at your location");
                    $("#msg_for_not_avl").text("Out of stock at your location");
                    $('#addToCart').prop('disabled', true);
                }
            );

        }
    }

}




    function getSelectedAddressDetails1(productid, zipcode) {
        var check_pincode = $scope.availablepincode.indexOf(zipcode);
           if(check_pincode == -1){
                $("#msg_for_not_avl").text("Out of stock at your location");
                $('#addToCart').prop('disabled', true);
           }
           else{ 
            ProductDetailService.checkSalabilityByItemandPincode(productid, zipcode)
            .then(
                function successCallback(response) {
                    //console.log("response Details:" + JSON.stringify(response.data));
                    $scope.msg = response.data.message;
                    $('#addToCart').prop('disabled', false);
                    $("#add_to_cart_active").html('<i class="fa fa-check" aria-hidden="true" style="color:green"></i> <span style="color:green"> In Stock </span>');
                    itemcurrentstock = response.data.status;
                    

                    // if (response.data.status > 0) {
                    //     itemcurrentstock = response.data.status;
                    //     // localStorage.setItem("userlat", latitude);
                    //     // localStorage.setItem("userlng", longitude);

                    //     $('#addToCart').prop('disabled', false);
                    //     $("#add_to_cart_active").html('<i class="fa fa-check" aria-hidden="true" style="color:green"></i> <span style="color:green"> In Stock </span>');
                    // }
                    // else {
                    //     $("#add_to_cart_not_active").text("Out of stock at your location");
                    // }
                },
                function error(response) {
                    $("#add_to_cart_not_active").text("Out of stock at your location");
                }
            );
        }
    }    




     // ....................................new code for pincode check end................................................
 



    function getRelatedProducts(contentId, strength, groupId) {
        // var strength1 = ''
        if(strength == null){
            strength ='NA';
            // alert("Hiiiiiiiiiiiiii");
        }
        else{
            strength = strength;
        }
       
  $http.get(serverurl+"/items/details/content/" + contentId + "?strength=" + strength.replace(/%/g, '') + "&groupId=" + groupId)            
           .then(
                function(response) {
                    $scope.relatedProducts1 = response.data;
                    $scope.relatedProducts2 = [];
                    $scope.relatedProducts = [];
                    for(var i=0;i<$scope.relatedProducts1.length;i++){
                            if($scope.relatedProducts2.indexOf($scope.relatedProducts1[i].id) === -1){
                                $scope.relatedProducts2.push($scope.relatedProducts1[i].id);
                                $scope.relatedProducts.push($scope.relatedProducts1[i]);
                            }
                    }
                    return $scope.relatedProducts2;
                    return $scope.relatedProducts;                     
                },
                function(errResponse) {}
            );
    }

    self.viewItems = function(category,group,metatag,pid) {
        if (pid > 0) {
            //console.log("item clicked");
            //window.localStorage.setItem('selecteditemid', pid);
            $location.path($rootScope.contextpath+"/product/"+category+"/"+group+"/"+metatag);
            $route.reload();
        }

    }




    self.addItems = function(name, price, id, quantity) {

        // alert("Hi");
        // alert(id);
        // alert(quantity);
        $scope.cartitems = [];
        $scope.flag = null;

        $scope.cart = {};
        $scope.cart.id=0;
        $scope.status = $cookies.get('Status');

        var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        var totqty = quantity;
        // alert($scope.status);


        if (cart_items != null) {
            for (var i = 0; i < cart_items.length; i++) {
                if (cart_items[i].itemId == id) {
                    totqty = Number(totqty) + Number(cart_items[i].packQty);
                    $scope.cart.id=cart_items[i].id;
                    $route.reload();
                    break;
                }
            }
        }
        if (totqty <= itemcurrentstock) {
           // alert("In stock");
            $scope.msg = "";

            $scope.cart.itemId = id;
            $scope.cart.packQty = totqty;
            $scope.cart.name = name;
            $scope.cart.price = price;

            if ($scope.status == 'Active') {
              // alert("Active working");
                /*$scope.cart.id=0;*/
                ProductDetailService.addItemInCart($scope.cart)
                    .then(
                        function successCallback(response) {
                            localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                            //console.log("add data" + JSON.parse(localStorage.getItem("cartLocalStorage")));
                            $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;
                            $route.reload();                           
                        },
                        function error(response) {
                          //console.log("Error Occoured");
                        }
                    );
            } else {
                // activity for local storage         
                if (localStorage.getItem("cartLocalStorage") === null) {
                    /*$scope.cart.id=0;*/
                    $scope.cartitems.push($scope.cart);
                    //console.log("cart item data : " + JSON.stringify($scope.cartitems));
                    localStorage.setItem("cartLocalStorage", JSON.stringify($scope.cartitems));
                     $route.reload();
                } else {
                    $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
                    ////console.log("cart item data : " + JSON.stringify(JSON.parse(localStorage.getItem("cartLocalStorage"))));
                    for (var i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[i].itemId == id) {
                            $scope.flag = i;
                            //$route.reload();
                            get_cart_product_dup();
                            break;
                        }
                    }

                    if ($scope.flag != null) {
                        $scope.items[$scope.flag].packQty = Number($scope.items[$scope.flag].packQty) + Number(quantity);
                        
                    } else {
                     /*   $scope.cart.id=0;*/
                        $scope.items.push($scope.cart);
                    }
                    localStorage.setItem("cartLocalStorage", JSON.stringify($scope.items));
                }

                //console.log(localStorage.getItem("cartLocalStorage"));
                $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;
            }
            
           /*$.alert.open('Item Added Successfully');*/  
            // $("#alertMsgText").html('');
            // $("#alertMsgText").html('Item Added Successfully');
            // $("#alert-modal").modal('show');
            $("#succes_add_cart").html('<img src="/yewmed/themes/img/yewmed_new_pics/product/tick_icon.png"> <b style="font-size:11px">ADDED TO CART SUCCESSFULLY ! </b>');
            $timeout(function() {
                            $("#succes_add_cart").html('');
                        }, 5000);

        } else {
            /*var updatedstock= Number(itemcurrentstock) - Number(totqty);
             if(itemcurrentstock!=0 && updatedstock>0){
              $scope.msg="Please Add quantity within "+itemcurrentstock;
             }
            else{
              $scope.msg="Not available";
            }*/
            //alert("We can't deliver at your pincode");
             alertify.set({ buttonReverse: true });
              alertify.confirm("We can't deliver this item at your location", function (e) {
                if (e) {}
            });
            //$scope.msg="Not available";

        }

        //$route.reload();
        get_cart_product_dup();
        
    }



     // ...........................alternate cart button ........................



     self.addItems1 = function(name, price, id, quantity) {

        // alert("Hi");
        // alert(id);
        // alert(quantity);
        $scope.cartitems = [];
        $scope.flag = null;

        $scope.cart = {};
        $scope.cart.id=0;
        $scope.status = $cookies.get('Status');

        var cart_items = JSON.parse(localStorage.getItem("cartLocalStorage"));
        var totqty = quantity;
        // alert($scope.status);


        if (cart_items != null) {
            for (var i = 0; i < cart_items.length; i++) {
                if (cart_items[i].itemId == id) {
                    totqty = Number(totqty) + Number(cart_items[i].packQty);
                    $scope.cart.id=cart_items[i].id;
                    $route.reload();
                    break;
                }
            }
        }
        if (totqty <= itemcurrentstock || itemcurrentstock <= totqty) {
           // alert("In stock");
            $scope.msg = "";

            $scope.cart.itemId = id;
            $scope.cart.packQty = totqty;
            $scope.cart.name = name;
            $scope.cart.price = price;

            if ($scope.status == 'Active') {
              // alert("Active working");
                /*$scope.cart.id=0;*/
                ProductDetailService.addItemInCart($scope.cart)
                    .then(
                        function successCallback(response) {
                            localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                            //console.log("add data" + JSON.parse(localStorage.getItem("cartLocalStorage")));
                            $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length; 
                            $route.reload();                          
                        },
                        function error(response) {
                          //console.log("Error Occoured");
                        }
                    );
            } else {
                // activity for local storage         
                if (localStorage.getItem("cartLocalStorage") === null) {
                    /*$scope.cart.id=0;*/
                    $scope.cartitems.push($scope.cart);
                    //console.log("cart item data : " + JSON.stringify($scope.cartitems));
                    localStorage.setItem("cartLocalStorage", JSON.stringify($scope.cartitems));
                     $route.reload();
                } else {
                    $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
                    ////console.log("cart item data : " + JSON.stringify(JSON.parse(localStorage.getItem("cartLocalStorage"))));
                    for (var i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[i].itemId == id) {
                            $scope.flag = i;
                            //$route.reload();
                            get_cart_product_dup();
                            break;
                        }
                    }

                    if ($scope.flag != null) {
                        $scope.items[$scope.flag].packQty = Number($scope.items[$scope.flag].packQty) + Number(quantity);
                        
                    } else {
                     /*   $scope.cart.id=0;*/
                        $scope.items.push($scope.cart);
                    }
                    localStorage.setItem("cartLocalStorage", JSON.stringify($scope.items));
                }

                //console.log(localStorage.getItem("cartLocalStorage"));
                $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;
            }
            
            // $.alert.open('Item Added Successfully');  
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Item added in cart successfully');
            $("#alert-modal").modal('show');
            // $("#succes_add_cart").html('<img src="themes/img/yewmed_new_pics/product/tick_icon.png"> <b style="font-size:11px">ADDED TO CART SUCCESSFULLY ! </b>');
            // $timeout(function() {
            //                 $("#succes_add_cart").html('');
            //             }, 5000);

            // alert("Item added in cart Successfully.")

        } else {
            /*var updatedstock= Number(itemcurrentstock) - Number(totqty);
             if(itemcurrentstock!=0 && updatedstock>0){
              $scope.msg="Please Add quantity within "+itemcurrentstock;
             }
            else{
              $scope.msg="Not available";
            }*/
            $scope.msg="Not available";

        }

        //$route.reload();
        get_cart_product_dup();
        
    }







    // ...........................alternate cart button end........................




    $scope.calculateSelectedProductPrice = function() {
        //console.log("id:" + $scope.product.contentId);
        $scope.actualPrice = 0;
        if ($scope.product.contentId.taxTypeId == 1) { //Tax Inclusive
            $scope.baseprice = ($scope.product.price / (1 + ($scope.product.saleTaxPercentage / 100)));
            if ($scope.product.isDiscount == 1) {
                $scope.discountamt = parseFloat(($scope.baseprice * $scope.product.discount / 100)).toFixed(2);
                $scope.taxableamt = ($scope.baseprice - $scope.discountamt);
            } else {
                $scope.taxableamt = $scope.baseprice;
            }
            $scope.taxamt = parseFloat(($scope.taxableamt * $scope.product.saleTaxPercentage / 100)).toFixed(2);
            $scope.actualPrice = parseFloat(Number($scope.taxableamt) + Number($scope.taxamt)).toFixed(2);

        } else { //Tax Exclusive
            if ($scope.product.isDiscount == 1) {
                $scope.discountamt = parseFloat(($scope.product.price * $scope.product.discount / 100)).toFixed(2);
                $scope.taxableamt = ($scope.product.price - $scope.discountamt);
            } else {
                $scope.taxableamt = $scope.product.price;
            }
            $scope.taxamt = parseFloat(($scope.taxableamt * $scope.product.saleTaxPercentage / 100)).toFixed(2);
            $scope.actualPrice = parseFloat(Number($scope.taxableamt) + Number($scope.taxamt)).toFixed(2);
        }

        $scope.selected_product_price = $scope.actualPrice;
        $scope.total_price = parseFloat(Math.round($scope.selected_product_price)).toFixed(2);


    }

    $scope.changePrice = function() {
        if($scope.customer_selected_qty.length ==0){
          $scope.customer_selected_qty = 1;
          $scope.total_price = parseFloat(Math.round($scope.selected_product_price * $scope.customer_selected_qty)).toFixed(2);
        }
        else{
          $scope.total_price = parseFloat(Math.round($scope.selected_product_price * $scope.customer_selected_qty)).toFixed(2);
        }
    }

    $scope.changePriceUp = function(){
      $scope.customer_selected_qty = $scope.customer_selected_qty+1;
      $scope.total_price = parseFloat(Math.round($scope.selected_product_price * $scope.customer_selected_qty)).toFixed(2);
    }

    $scope.changePriceDown = function(){
      if($scope.customer_selected_qty <= 1){
      $scope.customer_selected_qty = $scope.customer_selected_qty;
      $scope.total_price = parseFloat(Math.round($scope.selected_product_price * $scope.customer_selected_qty)).toFixed(2);
     }
     else{
          $scope.customer_selected_qty = $scope.customer_selected_qty-1;
      $scope.total_price = parseFloat(Math.round($scope.selected_product_price * $scope.customer_selected_qty)).toFixed(2);
     }
    }



//     $scope.getLatLngByZipcode = function(zipcode) {
//       alert(zipcode);
//     var geocoder = new google.maps.Geocoder();
//     var address = zipcode;
//     geocoder.geocode({ 'address': 'zipcode '+address }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             var latitude = results[0].geometry.location.lat();
//             var longitude = results[0].geometry.location.lng();
//             alert("Latitude: " + latitude + "\nLongitude: " + longitude);
//         } else {
//             alert("Request failed.")
//         }
//     });
//     return [latitude, longitude];
// }



    self.checkSalability = function(productid) {
        $("#not_active_false_p").hide();
        $("#add_to_cart_active").text("");
        $("#add_to_cart_not_active").text("");
        $("#msg_for_avl").text("");
        $("#msg_for_not_avl").text("");

        //alert(productid);
        //var zipcode=$scope.customer_zip_code;
        // var geocoder = new google.maps.Geocoder();
        /*geocoder.geocode({ 'address': zipcode }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {*/
        // var latitude = results[0].geometry.location.lat();
        // var longitude = results[0].geometry.location.lng();
           // for temporary use

       var latitude = '22.586408';
       var longitude = '88.400107';
       // var deferred = $q.defer();
       
        // alert("tokenCookie : " + tokenCookie);
        //console.log("tokenCookie found:"+tokenCookie)

       if(tokenCookie != '' && tokenCookie != undefined) {
        
         $http.get(serverurl+"/users/details",{
                     headers:{'Authorization': tokenCookie}
              })
           .then(
           function (response) {
             //console.log("response:"+JSON.stringify(response.data))
             $scope.users=response.data;
             //console.log("$scope.users : " + JSON.stringify($scope.users));

             if($scope.users.addresses.length ==0){
                latitude = '22.586408';
                longitude = '88.400107';
                getSelectedAddressDetails(productid, latitude, longitude);
             }

             else {
             
             for(var x=0; x<$scope.users.addresses.length; x++){
                    if($scope.users.addresses[x].isDefault == 1){
                        var defaultadd = x;
                    }
                }
               // alert("latitude: "+$scope.users.addresses[defaultadd].latitude+", longitude: "+$scope.users.addresses[defaultadd].longitude);
               latitude = $scope.users.addresses[defaultadd].latitude;
               //console.log("Default latitude:"+ latitude);
               //console.log("check adress :  " + JSON.stringify($scope.users));
               longitude = $scope.users.addresses[defaultadd].longitude;
               getSelectedAddressDetails(productid, latitude, longitude);
           }

           },
           function(errResponse){
              //console.error("errResponse:"+'Error while fetching users details');
               
              }
            );       
        }
   else {
           latitude = '22.586408';
           longitude = '88.400107';
           getSelectedAddressDetails(productid, latitude, longitude);
        }

      // alert("Final lattitude & longitude : " + latitude + " , " +  longitude);

        // var customerdata=JSON.parse(localStorage.getItem("loggedinuserdetails"));
        // var latitude = '22.586408';
        // var longitude = '88.400107';

        // if($scope.users!=null){
        //     for(var x=0; x<$scope.users.addresses.length; x++){
        //         if($scope.users.addresses[x].isDefault == 1){
        //             var defaultadd = x;
        //             alert(defaultadd);
        //         }
        //     }
        //    alert("latitude: "+$scope.users.addresses[defaultadd].latitude+", longitude: "+$scope.users.addresses[defaultadd].longitude);
        //    latitude = $scope.users.addresses[defaultadd].latitude;
        //     //console.log("check adress :  " + JSON.stringify($scope.users));
        //     alert($scope.users.addresses[defaultadd].pincode);
        //    longitude = $scope.users.addresses[defaultadd].longitude; $scope.users
        //    // alert(longitude);
        // }
        // else{
        //       latitude = '22.586408';
        //       longitude = '88.400107';
        // }
        // ProductDetailService.checkSalabilityByItem(productid, latitude, longitude)
        //     .then(
        //         function successCallback(response) {
        //             //console.log("response Details:" + JSON.stringify(response.data));
        //             $scope.msg = response.data.message;
                    

        //             if (response.data.status > 0) {
        //                 itemcurrentstock = response.data.status;
        //                 localStorage.setItem("userlat", latitude);
        //                 localStorage.setItem("userlng", longitude);

        //                 $('#addToCart').prop('disabled', false);
        //                 $("#msg_for_avl").text(response.data.message);
        //                 $timeout(function() {
        //                     $("#msg_for_avl").text('');
        //                 }, 5000);
        //             }
        //             else {
        //                 $("#msg_for_not_avl").text(response.data.message);
        //                 $timeout(function() {
        //                     $("#msg_for_not_avl").text('');
        //                 }, 5000);
        //             }
        //         },
        //         function error(response) {}
        //     );

        /*} else {
                 //alert("Request failed.")
             }
         });*/

         // return deferred.promise;

    }


   $scope.$on('ngRealatedProductCarousel', function(ngRepeatFinishedEvent) {
    // alert("Hi");
    $('.featured-pro-active2')
        .on('changed.owl.carousel initialized.owl.carousel', function (event) {
            $(event.target)
                .find('.owl-item').removeClass('last')
                .eq(event.item.index + event.page.size - 1).addClass('last');
               
        }).owlCarousel({
            autoplay: true,
            loop: true,
            nav: false,
            dots: false,
            smartSpeed: 300,
            margin: 0,
            responsive: {
                0: {
                    items: 1,
                    autoplay: true,
                    smartSpeed: 100
                },
                500: {
                    items: 2
                },
                768: {
                    items: 3
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 5
                }
            }
        });

        var owl_related_pro = $('.featured-pro-active2');

        $("#home_rela_pro_sli_next").click(function() {
          owl_related_pro.trigger('next.owl.carousel');
        });
        $("#home_rela_pro_sli_prev").click(function() {
          owl_related_pro.trigger('prev.owl.carousel');
        });
 });

   /*For Wish List*/

   $scope.addItemsInWishList = function(id) {
      
        $scope.wishList = [];
        $scope.flag = false;
        $scope.wistItem = {};
        $scope.wistItem.id=0;
        $scope.status = $cookies.get('Status');
        var wish_items = JSON.parse(localStorage.getItem("wishListLocalStorage"));
        //console.log("wishListLocalStorage:::"+localStorage.getItem("wishListLocalStorage"));
        var qty = 1;

         if (wish_items != null) {
            for (var i = 0; i < wish_items.length; i++) {
                if (wish_items[i].itemId == id) {
                      $scope.flag = true;
                     break;
                }
            }
            
        }

        
        if($scope.flag == true){
            /*$.alert.open('Item Already Exist In Wish List');*/
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Item Already Exist In Wish List');
            $("#alert-modal").modal('show');
        }
        else{
            $scope.msg = "";
            $scope.wistItem.itemId = id;
            $scope.wistItem.packQty = qty;
            if ($scope.status == 'Active') {
                ProductDetailService.inputItemInWishList($scope.wistItem)
                    .then(
                        function successCallback(response) {
                            localStorage.setItem("wishListLocalStorage", JSON.stringify(response));
                            $rootScope.totalitemsinwishlist = JSON.parse(localStorage.getItem("wishListLocalStorage")).length;                           
                        },
                        function error(response) {
                          //console.log("Error Occoured");
                        }
                    );
            } 
            
           /*$.alert.open('Item Added Successfully in Wish List');*/  
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Item Added Successfully in Wish List');
            $("#alert-modal").modal('show');
        }



    }


 $scope.openProductWindow = function(item) {
    var itemdata = JSON.stringify(item);
   /* alert(itemdata);*/
    $scope.itemName=item.name;
    $scope.itemPrice=item.price;
    $scope.itemSchedule=item.schedule;
    $scope.itemDetails=item.content;
    $('#product-window').modal("show");

 }

 // self.viewItems = function(pid) {
 //      if(pid>0) {
 //        window.localStorage.setItem('selecteditemid',pid);
 //          $route.reload();
 //      }
 //    }


self.addItemsInWishList = function(id) {
        $scope.wishList = [];
        $scope.flag = false;
        $scope.wistItem = {};
        $scope.wistItem.id=0;
        $scope.status = $cookies.get('Status');
        
        if ($scope.status == 'Active') {
        var wish_items = JSON.parse(localStorage.getItem("wishListLocalStorage"));
        //console.log("wishListLocalStorage:::"+localStorage.getItem("wishListLocalStorage"));
        var qty = 1;

         if (wish_items != null) {
            for (var i = 0; i < wish_items.length; i++) {
                if (wish_items[i].itemId == id) {
                      $scope.flag = true;
                     break;
                }
            }
            
        }
        if($scope.flag == true){
            /*$.alert.open('Item Already Exist In Wish List');*/ 
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Item Already Exist In Wish List');
            $("#alert-modal").modal('show');
        }
        else{
            $scope.msg = "";
            $scope.wistItem.itemId = id;
            $scope.wistItem.packQty = qty;
            ProductDetailService.inputItemInWishList($scope.wistItem)
                    .then(
                        function successCallback(response) {
                            localStorage.setItem("wishListLocalStorage", JSON.stringify(response));
                            $rootScope.totalitemsinwishlist = JSON.parse(localStorage.getItem("wishListLocalStorage")).length;                           
                        },
                        function error(response) {
                          //console.log("Error Occoured");
                        }
                    );
             /*$.alert.open('Item Added Successfully in Wish List');*/
             $("#alertMsgText").html('');
             $("#alertMsgText").html('Item Added Successfully in Wish List');
             $("#alert-modal").modal('show');
        }

       }else{
         /*$.alert.open('Please Login');*/
          // $("#alertMsgText").html('');
          // $("#alertMsgText").html('Please Login');
          // $("#alert-modal").modal('show');
          $('#login-window').modal("show");
       }

    }


}]);