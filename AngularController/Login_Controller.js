/**
 * 
 */
'use strict';

angular.module('myApp').controller('LoginController', ['$timeout', '$q', '$log','$http','$scope', '$cookies', '$location', '$interval', 'LoginService', 'Idle', 'Keepalive', '$route', 'ProductDetailService','CartService', '$rootScope','MemberPlanService', 'CommonService' , "$window" , function($timeout, $q, $log, $http,$scope, $cookies, $location, $interval, LoginService, Idle, Keepalive, $route, ProductDetailService,CartService, $rootScope,MemberPlanService,CommonService,$window) {
    // $rootScope.contextpath = '/yewmed'
    // $rootScope.contextpath1 = '/yewmed/';
     $rootScope.contextpath = '';
     $rootScope.contextpath1 = '/';
    var self = this;
    self.user = {email: '',password: ''};
    self.login = login;
    self.logout = logout;
    self.userSubmit = userSubmit;
    self.resetPassword = resetPassword;
    $scope.coma = ",";
     $scope.categoriesMenu = [];
     self.register={addresses:[]};
     self.resetpswrd = {email: ''};
     get_cart_product_dup();
     self.Subscriber = {};

    self.successMessage = '';
    self.errorMessage = '';

    var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var intRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    
    //self.register={fname:'',lname:'',dob:'',gender:'',contactPhone:'',email:'',password:'',streetAddress:'',countryId:'',stateId:'',city:'',pincode:'',landmark:'',type:''};

    var promise;
    $scope.events = [];
     $scope.ani_url ='';
     $scope.regenerate_otp = 0;
     $scope.check_generate_otp = 0;
     $scope.check_generateotp_timer = 0;
     $scope.timer2 = 0;
     $scope.usernamecheck = "";


     $scope.pressEnter = function(){
          //alert(self.searchText);
          if(self.searchText.length>0){
          localStorage.setItem("serachItemPressEnterdata", self.searchText);        
          $location.path($rootScope.contextpath+"/serachbaseitem");
          document.getElementById("mySidenav").style.width = "0";
          $('.mobile_view_opacity').css({"opacity":"1"});
          self.searchText = '';
          $route.reload();
        }
     }


   $("#register_button_id").prop('disabled', true);

    $rootScope.statusCookie = $cookies.get('Status');
    if ($rootScope.statusCookie === undefined) {
        $rootScope.statusCookie = 'Deactive';
    }
    if ($rootScope.statusCookie == 'Active') {
        getActivePlanId();
    }



    // alert("Hi");
    $(".ng-not-empty").val("");



    // ......................for telemidicine start..........................
     $scope.openTeleMedicine = function(){
         $scope.present_phoneno = false;
         $scope.present_emailid = false;
         $scope.phonenoTeliMedVlidation = true;
         $scope.emailidTeliMedVlidation = false;
         console.log($cookies.get('Token'));
         if($cookies.get('Token')){
            //alert("Hiiiiii");
            var tokenCookie = $cookies.get('Token');
            $http.get(serverurl+"/users/details",{
                    headers:{'Authorization': tokenCookie}
            })
            .then(
                function successCallback(response) {
                $scope.userdataforTelimed = response.data;
                  
                if(response.data.email && response.data.phone){
                   var password = localStorage.getItem('pswdForTeliMed');
                   console.log(password);
                   var encrypt_data = CryptoJS.AES.encrypt(password, 'alok123').toString(); 
                   var encrypted_password = CryptoJS.enc.Base64.parse(encrypt_data).toString(CryptoJS.enc.Hex);
                   console.log(encrypted_password);
                   //var encrypted_password = CryptoJS.AES.encrypt(password, 'alok123');
                   $scope.teliMedApiCall($scope.userdataforTelimed.email , $scope.userdataforTelimed.phone, $scope.userdataforTelimed.fname, $scope.userdataforTelimed.lname, encrypted_password)
                }
                else{
                $("#telemedicine-window").modal("show");

                if(response.data.email){
                    $scope.present_emailid = true;
                    //alert("kjjkjk")
                }
                if(response.data.phone){
                    $scope.present_phoneno = true;
                    //alert("lllllllllll");
                }
              } 
             },
             function(errResponse){
               console.error("errResponse:"+'Error while fetching users details');   
             });     
         }
         else{
            $window.open("https://azureswastha.com", '_blank');
         }
     }


     $scope.callTeliMedApi = function(){
        var password = localStorage.getItem('pswdForTeliMed');
        console.log(password);
        var encrypt_data = CryptoJS.AES.encrypt(password, 'alok123').toString(); 
        var encrypted_password = CryptoJS.enc.Base64.parse(encrypt_data).toString(CryptoJS.enc.Hex);
        console.log(encrypted_password);
        var tokenCookie = $cookies.get('Token');
        // var encrypted_password = CryptoJS.AES.encrypt(password, 'alok123');
        $scope.phonenoTeliMedVlidation = false;
        $scope.emailidTeliMedVlidation = false;
        if($scope.present_emailid && !$scope.present_phoneno){
           var phoneno = $("#phoneno_telimed").val();
           if(phoneno.length != 10){
              $scope.phonenoTeliMedVlidation = true;
           }
           else{
              $scope.newPhone = {"password":password,"phone":phoneno};
              $http.post(serverurl+"/users/updatePhone",$scope.newPhone,{
                 headers:{'Authorization': tokenCookie}
              })
              .then(
              function (response) {
                $scope.teliMedApiCall($scope.userdataforTelimed.email , phoneno, $scope.userdataforTelimed.fname, $scope.userdataforTelimed.lname, encrypted_password)
              },
              function(errResponse){
                 $scope.phonenoTeliMedVlidation = true;
              })
           }
        }
        else if(!$scope.present_emailid && $scope.present_phoneno){
           var emailid = $("#emailid_telimed").val();
           if(!emailReg.test(emailid)){
             $scope.emailidTeliMedVlidation = true;
           }
           else{
              $scope.teliMedApiCall( emailid, $scope.userdataforTelimed.phone , $scope.userdataforTelimed.fname, $scope.userdataforTelimed.lname, encrypted_password)
           }
        }
        else if(!$scope.present_emailid && !$scope.present_phoneno){
            var phoneno = $("#phoneno_telimed").val();
            var emailid = $("#emailid_telimed").val();
            if(phoneno.length != 10){
              $scope.phonenoTeliMedVlidation = true;
              $("teleMedPhoneErrorMsg").html("Please Enter Valid Phone No.");
            }
            else if(!emailReg.test(emailid)){
               $scope.emailidTeliMedVlidation = true;
               $("teleMedPhoneErrorMsg").html("This Phone No is already Exist.");
            }
            else{
            $scope.teliMedApiCall( emailid, phoneno , $scope.userdataforTelimed.fname, $scope.userdataforTelimed.lname, encrypted_password)
            }
        }
     }


     $scope.teliMedApiCall = function(email, phoneno, fname , lname, password){
          $("#telemedicine-window").modal("hide");  
          $("#emailid_telimed").val("");
          $("#phoneno_telimed").val("");
          var url = "https://azureswastha.com/patient-register-anothersite?firstName="+fname+"&lastname="+lname+"&email="+email+"&phone="+phoneno+"&password="+password;    
          console.log(url);
          // $http.get("https://azureswastha.com/patient-register-anothersite?firstName="+fname+"&lastname="+lname+"&email="+email+"&phone="+phoneno+"&password="+password)
          //   .then(
          //       function successCallback(response) {
          //    },
          //    function(errResponse){
          //      console.error("errResponse:"+'Error while fetching users details');   
          //    }); 
          $window.open(url, '_blank');
     }


    // ......................for telemidicine end..........................




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


    $scope.subscribe_us = function(){
        var subscribe_mail = $("#subscribe_us_email").val();
        self.Subscriber.email = subscribe_mail;
        // console.log(self.Subscriber);
        if(!subscribe_mail){
            $scope.subscribe_mail_msg_clr = 'Red';
            $('#subscribe_mail_msg').html("Please enter email id");
            $("#subscribe_us_email").val("");
            $timeout(function() {
                    $('#subscribe_mail_msg').html("");
                }, 4000);
        }
        else {
            if(emailReg.test(subscribe_mail)){
                $http.post(serverurl+"/contact/subscribedemail",self.Subscriber)
                   .then(
                   function (response) {
                      if(response.data.status == 1){
                          $scope.subscribe_mail_msg_clr = 'green';
                          $('#subscribe_mail_msg').html(response.data.message);
                          $("#subscribe_us_email").val("");
                          $timeout(function() {
                              $('#subscribe_mail_msg').html("");
                          }, 4000);
                      }
                      else{
                          $scope.subscribe_mail_msg_clr = 'red';
                          $('#subscribe_mail_msg').html(response.data.message);
                          $("#subscribe_us_email").val("");
                          $timeout(function() {
                              $('#subscribe_mail_msg').html("");
                          }, 4000);
                      } 
                   },
                   function(errResponse){

                   }
                  );
                }
            else{
              $scope.subscribe_mail_msg_clr = 'Red';
              $('#subscribe_mail_msg').html("Please enter valid email id");
              $("#subscribe_us_email").val("");
                $timeout(function() {
                    $('#subscribe_mail_msg').html("");
                }, 4000);
            }
        }
    }

    // ..............................new code end.........................




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
              
    $scope.$on('IdleStart', function() {
        // the user appears to have gone idle
        // console.log("Idle");
        if ($rootScope.statusCookie == 'Active') {
           promise = $interval(callAtInterval, 10000); // Start calling callAtInterval function in 10 second interval
        }
    });

    /*$scope.$on('IdleWarn', function(e, countdown) {
    // follows after the IdleStart event, but includes a countdown until the user is considered timed out
    // the countdown arg is the number of seconds remaining until then.
    // you can change the title or display a warning dialog from here.
    // you can let them resume their session by calling Idle.watch()
  });
   
  $scope.$on('IdleTimeout', function() {
    // the user has timed out (meaning idleDuration + timeout has passed without any activity)
    // this is where you'd log them
  });
  $scope.$on('Keepalive', function() {
  // do something to keep the user's session alive
   });
  */

    $scope.$on('IdleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        $interval.cancel(promise); // stop calling callAtInterval function
    });


function callAtInterval() {
        console.log("Interval occurred");
        // call for new token
    }


    function login() {
       self.user.loginType='USER';
       // console.log("Login Json" + JSON.stringify(self.user));
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
                   localStorage.setItem("pswdForTeliMed", self.user.password)
                    /*var latitude = '22.57139428';
                    var longitude = '88.35056187';
                    localStorage.setItem("userlat", latitude);
                    localStorage.setItem("userlng", longitude);*/
                    getUserDetails(); // call for geting login user data with address
                    getWishList();
                    $route.reload();
                    // alert(ani_url);
                    self.cartItems = localStorage.getItem("cartLocalStorage");
                    // alert("cart items"+ self.cartItems);
                    if (localStorage.getItem("cartLocalStorage") != null) {
                        ProductDetailService.addBulkItemInCart(JSON.parse(localStorage.getItem("cartLocalStorage"))).then(
                            function successCallback(response) {
                                if (response != null) {
                                    localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                                    $rootScope.totalitemsincart = response.length;
                                     /*var result=uri.split("/").pop()*/
                                     if ($location.absUrl().split('/').pop() == "register") {
                                        $location.path($rootScope.contextpath1);
                                      }  

                                    $route.reload();
                                }
                            },
                            function error(response) {
                                
                            }

                        );


                    } 
                    else {
                        callCart();
                    }
                    // else if (localStorage.getItem("cartLocalStorage") == null) {
                        
                    //     callCart();
                    // }
                    //  if ($location.absUrl().split('/')[4] == "register") {
                    //     alert("hello");
                    // }
                    // else {

                    // }

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

                     if(localStorage.getItem("membershipdetails") == null ){
                         getAllPlans();
                        }
                      if(localStorage.getItem("membershipfeatures") == null ){
                           getFeatures();
                       }
                     getActivePlanId();
                     $route.reload();
                },
                function error(response) {
                    
                }

            );
        }



       function resetPassword(){
            // alert("Hi");
            // console.log("Reset Password"+ self.resetpswrd.email);
            // console.log(JSON.stringify(self.resetpswrd));
            $http.post(serverurl+"/mail/forgot",self.resetpswrd)
             .then(
             function (response) {
               // console.log("response:"+JSON.stringify(response.data));
               $('#resetpswrd-window').modal('hide');
             },
             function(errResponse){
                console.error("errResponse:"+JSON.stringify(errResponse.data.message));
                // alert(errResponse.data.message);
                $('#reset_pswd_error').html(errResponse.data.message);
                $timeout(function() {
                    $('#reset_pswd_error').html("");
                }, 4000);
             }
         );
       }



     /*For membership (start)*/
    function getAllPlans(){
            MemberPlanService.getAllMembershipPlans()
                .then(
                    function successCallback(response) {
                     // console.log("getAllPlans"+JSON.stringify(response.data));
                     localStorage.setItem("membershipdetails", JSON.stringify(response.data));
                     getActivePlanId();
                       },
                    function error(response) {}
                );
            }
     function getFeatures(){
            MemberPlanService.getAllFeatures()
                .then(
                    function successCallback(response) {
                        // console.log("getFeatures"+JSON.stringify(response.data));
                        localStorage.setItem("membershipfeatures", JSON.stringify(response.data));
                      },
                    function error(response) {}
                );
      }
    

    function getActivePlanId(){
        //alert("getActivePlanId"+$rootScope.points);
     if(localStorage.getItem("membershipdetails") != null ){
         var plans = JSON.parse(localStorage.getItem("membershipdetails"));
         for(var i=1;i<=plans.length-1;i++){
          if($rootScope.points>=plans[i-1].pointMin && $rootScope.points<plans[i].pointMin){
               localStorage.setItem("activeplanid", plans[i-1].id);
               localStorage.setItem("activeplan", JSON.stringify(plans[i-1]));
                   $scope.class= '';
                   switch (plans[i-1].name) {
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

                  $rootScope.activeclass=$scope.class;
                  //alert($rootScope.activeclass);


             }
           }

           if($rootScope.points>=plans[plans.length-1].pointMin){
               localStorage.setItem("activeplanid", plans[plans.length-1].id);
               localStorage.setItem("activeplan", JSON.stringify(plans[plans.length-1]));
                   $scope.class = "platinum";
                   $rootScope.activeclass=$scope.class;
                    }

       localStorage.setItem("currentactiveclass", $rootScope.activeclass);
      }
    }

  /*For membership (end)*/

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


    $scope.reset = function() {
        self.user = {email: '',password: ''};
        $("#login").hide();
        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
        $scope.msg = "";

    }
    $scope.close = function() {
        $("#login").hide();
        $scope.reset();
    }
    $scope.open = function() {
        $scope.reset();
        $("#login").show();

    }

    self.viewItems = function(pid,grpip,grpname,cate_name,cateid,metatag) {
      var url = $location.url();
        if (pid > 0) {
            // console.log("clicked"+url);
            /*window.localStorage.setItem('selecteditemid', pid);
            window.localStorage.setItem("groupId",grpip);
            window.localStorage.setItem("grpname",grpname);
            window.localStorage.setItem("catename",cate_name);
            window.localStorage.setItem("cateid",cateid);*/
            $location.path($rootScope.contextpath+"/product/"+cate_name+"/"+grpname+"/"+metatag);
            if(url.includes("/product")) {
              $route.reload();
            }
        }
    }



  self.addItemsInWishList = function(id) {
      
        $scope.wishList = [];
        $scope.flag = false;
        $scope.wistItem = {};
        $scope.wistItem.id=0;
        $scope.status = $cookies.get('Status');
        
        if ($scope.status == 'Active') {
        var wish_items = JSON.parse(localStorage.getItem("wishListLocalStorage"));
        // console.log("wishListLocalStorage:::"+localStorage.getItem("wishListLocalStorage"));
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
                          console.log("Error Occoured");
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


    /*$(document).on("click", ".srcitem", function() {
        //self.viewItems($(this).attr("data-id"));
        console.log("clicked");
        window.localStorage.setItem('selecteditemid', $(this).attr("data-id"));
        // $location.path( "/yewmed/product");
        window.location = "/yewmed/product";
    })*/




    function logout() {
        document.getElementById("mySidenav").style.width = "0";
        $('.mobile_view_opacity').css({"opacity":"1"});
        $cookies.put('Status', 'Deactive');
        $rootScope.statusCookie = 'Deactive';
        $rootScope.totalitemsincart = 0;
        $rootScope.cartdata = [];
        $rootScope.cartdata_dup = [];
        // console.log($rootScope.cartdata_dup.length);
        /* $location.path( "/yewmed/");*/
        updateCartAtLogout();
        localStorage.removeItem("cartLocalStorage");
        localStorage.removeItem("userlat");
        localStorage.removeItem("userlng");
        localStorage.removeItem("loggedinuserdetails");
        localStorage.removeItem("addressid");
        localStorage.removeItem("activeplanid");
        localStorage.removeItem("activeplan");
        localStorage.removeItem("membershipfeatures");
        localStorage.removeItem("membershipdetails");
        localStorage.removeItem("currentpoints");
        localStorage.removeItem("currentactiveclass");
        localStorage.removeItem("wishListLocalStorage");
        
        $rootScope.activeusername='User'; 
        $rootScope.points=0;
        $rootScope.activeclass="";
        $route.reload();
    }

    function callCart() {
        LoginService.callCartData()
            .then(
                function successCallback(response) {
                    localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                    $rootScope.totalitemsincart = response.length;
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
   function updateCartAtLogout() {
        if (localStorage.getItem("cartLocalStorage") != null) {
                  //alert("logout:"+localStorage.getItem("cartLocalStorage"));
                        ProductDetailService.updateBulkItemInCart(JSON.parse(localStorage.getItem("cartLocalStorage"))).then(
                            function successCallback(response) {
                                $cookies.put('Token', '');
                                $route.reload();
                            },
                            function error(response) {
                                $scope.msg = "Invalid login credentials";
                            }
                            );
                      }
                    }
                    
$scope.closeLoginWindow = function() {
        //$("#login-window").hide();
        $('#login-window').modal("hide");
        // window.location = "/yewmed/register";
    }
    $scope.openLoginWindow = function() {
        //$("#login").show();
        document.getElementById("mySidenav").style.width = "0";
        $('.mobile_view_opacity').css({"opacity":"1"})
        $('#login-window').modal("show");
        $('#register-window').modal("hide");
        $('#resetpswrd-window').modal("hide");
        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
        $scope.msg = "";
        $("#login_uid").val("");
        $("#login_pwd").val("");
    }

    $scope.registerWindow = function() {
        //$("#login").show();
        $('#register-window').modal("show");
        $('#login-window').modal("hide");
        $scope.msg = "";
        $("#reg_fname").val("");
        $("#reg_userName").val("");
        $("#reg_password").val("");
        $("#reg_pincode").val("");
        $scope.registerForm.$setPristine();
        $scope.registerForm.$setUntouched();

    }

    $scope.resetpswrdWindow = function() {
        $('#resetpswrd-window').modal("show");
        $('#login-window').modal("hide");
        $scope.msg = "";
        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
    }

    // ............Hide pop up in forgot password page..................

    $scope.Forgotpasswrd_pophide = function() {
        $('#login-window').modal("hide");
        $("#uid").val("");
    }

    // ..................End................................

  /*$scope.openLoginWindow = function() {
    $('#login-window').modal("show");
 }*/

    self.simulateQuery = false;
    self.isDisabled    = false;

    self.repos1 = [];
    self.repos = loadAll();
    // self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

/*function querySearch (query) {
      var results = query ? self.repos.filter(createFilterFor(query)) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }*/

function searchTextChange(text) {
    $http.get(serverurl+"/items/searchbasic?name="+text)
       .then(
       function (response) {
         // console.log("response:"+JSON.stringify(response.data))
          self.repos1 = response.data;
          self.repos = loadAll();
           // console.log("Search Item:" + self.repos);
       },
       function(errResponse){
        console.error("errResponse:"+'Error while fetching.');
       }
    );
  }

function selectedItemChange(item) {
      //alert('Item changed to ' + JSON.stringify(item));
      // $("#input-0").val('');
      document.getElementById("mySidenav").style.width = "0";
      $('.mobile_view_opacity').css({"opacity":"1"});
      self.viewItems(item.id,item.groupId,item.group,item.category,item.categoryId,item.meta_tag);
    }
function loadAll() {
      return self.repos1.map(function (repo) {
        repo.value = repo.name.toLowerCase();
        return repo;
      });
    }
function createFilterFor(query) {
      var lowercaseQuery = query.toLowerCase();
      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }


LoginService.groupsMenuRequest()
              .then(
              function successCallback(response) {
                // console.log("groupsMenu Details:"+JSON.stringify(response.data));
                self.allGroups = response.data;
                    },  
                      function error(response) {
                      self.allGroups="groupsMenu not found";
                      }

          );

 
 // self.viewGroupWiseProducts = function(id) {
     
 //        alert("id: "+id);
 //        if(id>0) {
 //        $http.get(serverurl+"/items/details/group/"+id+"?page="+1+"&limit=16")
 //         .then(
 //         function (response) {
 //           console.log("viewGroupWiseProducts: "+JSON.stringify(response.data));
 //           // window.localStorage.setItem("productsBy",JSON.stringify(response.data));
 //           self.itemGroupWise=JSON.stringify(response.data);
 //            console.log("view products group wise"+self.itemGroupWise);
 //             if(self.itemGroupWise.length>0){
 //              alert("Hi view");
 //           $location.path( "/yewmed/groups");
 //             }
            
            
 //         },
 //         function(errResponse){
 //         }
 //      );
 //    }
 //  }

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


$scope.toggleShowPassword = function() {
    $scope.showPassword = !$scope.showPassword;
  }



  // $scope.checkUserid = function() {
  //     var register_userName = $("#userName").val();
  //     var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //     var intRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  //     if(register_userName !='') {
  //     if(intRegex.test(register_userName)) {
  //           var valid_phoneno = register_userName;
  //           if(valid_phoneno.length<10){
  //              $("#register_button_id").prop('disabled', true);
  //           }
  //           else {
  //              $("#register_button_id").prop('disabled', false);  
  //           }
  //     }
  //     else if (emailReg.test(register_userName)) {
  //         $("#register_button_id").prop('disabled', false);
  //     }
  //     else {
  //        $("#register_button_id").prop('disabled', true); 
  //     }
  //   }
  //   else {

  //   }
  // }



  function submit_registerform() {
    // console.log('Register User', JSON.stringify(self.register));
            // self.register.addresses[0].latitude = '22.58139428';
            // self.register.addresses[0].longitude = '88.36056187';
       
        LoginService.userRequest(self.register)
             .then(
             function successCallback(response) {
                 // console.log('User created successfully');
                 //var successMessage = 'User created successfully';
                 $("#username_error_check").text("");
                 self.errorMessage ='';
                 // console.log('Register User', response);
                 if(response.data.status == 0) {
                    // alert("User already exist");
                    $("#username_error_check").text(response.data.message);
                 }
                 else {
                    //alert("successfully submitted");
                    $('#register-window').modal("hide");
                    $('#success_register_modal').modal("show");
                    // $location.path( $rootScope.contextpath1 );
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


  $scope.generateOttp =function(user){
     //alert("HIII");
     $scope.check_generate_otp = 0;
     if(user == "email"){
       $("#generateotp_h5").html("A key send to your mailid. Pleae enter the key and complete the registration process")
     }
     else if(user == "phone"){
       $("#generateotp_h5").html("A key send to your phone no. Pleae enter the key and complete the registration process")
     }
     else{
     }
     $('#re_generate_otp_modal').modal("hide");
     $('#register-window').modal("hide");
     $('#generate_otp_modal').modal("show");
     $("#error_otp_msg").html("");

     //clearInterval(interval);

    //if($scope.check_generateotp_timer == 0){
    $scope.timer2 = "5:00";
    $scope.check_generateotp_timer = 1;
    var interval = setInterval(function() {
    var timer = $scope.timer2.split(':');
    //by parsing integer, I avoid all extra string processing
    var minutes = parseInt(timer[0], 10);
    var seconds = parseInt(timer[1], 10);
    --seconds;
    minutes = (seconds < 0) ? --minutes : minutes;
    if (minutes < 0) clearInterval(interval);
    seconds = (seconds < 0) ? 59 : seconds;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    //minutes = (minutes < 10) ?  minutes : minutes;
    $('.countdown').html(minutes + ':' + seconds);
    $scope.timer2 = minutes + ':' + seconds;
    if($scope.timer2=="0:00" && $scope.check_generate_otp==0){
      //alert(timer2);
      //$scope.regenerate_otp = 1;
      $("#re_generate_otp").html("The Key is expired. Please click on resend button for generate new otp.")
      $('#generate_otp_modal').modal("hide");
      $('#re_generate_otp_modal').modal("show");
     }
  }, 1000);
  //}
    
  }



$scope.login_with_otp = function(){
  var otp = $("#generate_otp_input").val();
     $http.get(serverurl+"/otp/validateOtp?otpnum="+otp)
         .then(
         function (response) {
             if(response.data.status == 0){
              //alert("kkkkkkkkkkkk");
                $('#generate_otp_modal').modal("show");
                $("#error_otp_msg").html(response.data.message);
                //$("#error_otp_msg").show();
             } 
             else{
              $scope.check_generate_otp = 1;
              submit_registerform(); 
             }    
         },
         function(errResponse){
         }
      );
}  


$scope.otp_send_to_mail = function(){
  //$("#error_otp_msg").hide();
  // alert("llllllllll");
  // alert($scope.usernamecheck);
  var emailobjforotp = {};
  var phoneobjforotp = {};
  emailobjforotp.email = self.register.email;
  phoneobjforotp.phone = self.register.phone;
  if($scope.usernamecheck == "email"){
  $http.post(serverurl+"/otp/generateOtp",emailobjforotp)
         .then(
         function (response) {
             $scope.generateOttp($scope.usernamecheck);      
         },
         function(errResponse){
         }
      );
  }
  else if($scope.usernamecheck == "phone"){
     // alert("kkkkkkkkkkk")
     $http.post(serverurl+"/otp/generateOtp",phoneobjforotp)
         .then(
         function (response) {
             $scope.generateOttp($scope.usernamecheck);      
         },
         function(errResponse){
         }
      );
  }
  else{

  }
}



function userSubmit(){
  $scope.check_generateotp_timer = 0;
  $scope.timer2 = "0:00";
   // alert("Hello");
   //$("#register-window").hide();
   $("#username_error_check").text("");
  var register_userName = $("#reg_userName").val();
  var register_name = $("#reg_name").val();
  self.register.fname = register_name.split(" ")[0];
  self.register.lname = register_name.split(" ")[1];
 
    //var register_userName = $("#userName").val();
     //alert("Register::"+self.register);
    //self.register.userName;



    if(intRegex.test(register_userName)) {
             var valid_phoneno = register_userName;
             if(valid_phoneno.length<10 || valid_phoneno.length>10){
                $("#username_error_check").text("Please enter valid phone no");
             }
            else {
                self.register.phone = self.register.userName;
                self.register.addresses[0].contactPhone = self.register.userName;
                //submit_registerform();
                $http.get(serverurl+"/users/checkEmail?email="+self.register.phone)
         .then(
         function (response) {
          if(response.data.status == 1){
             console.log(self.register.phone);
             $scope.usernamecheck = "phone";
             //$scope.otp_send_to_mail(); 
             submit_registerform();
           }
           else {
            $("#username_error_check").text("Username Already Registered.");
           }    
         },
         function(errResponse){
         }
      );
                //generateOttp();
             }
       }
    else if (emailReg.test(register_userName)) {
           self.register.email = self.register.userName;
           //submit_registerform(); user/checkEmail?email=abc.com
           //$http.post(serverurl+"/otp/generateOtp",emailobjforotp)
           $http.get(serverurl+"/users/checkEmail?email="+self.register.email)
         .then(
         function (response) {
          if(response.data.status == 1){
             console.log(self.register.email);
             $scope.usernamecheck = "email";
             //$scope.otp_send_to_mail(); 
             submit_registerform();
           
           }
           else {
            $("#username_error_check").text("Username Already Registered.");
           }    
         },
         function(errResponse){
         }
      );
           
           
      }
      else if (!intRegex.test(register_userName) || !emailReg.test(register_userName)) {
         $("#username_error_check").text("Please enter valid email id");
       }




    // alert(self.register.userName);
    // if(intRegex.test(self.register.userName)) {
    //       self.register.phone = self.register.userName;
    //   }
    //     else if (emailReg.test(self.register.userName)) {
    //       self.register.email = self.register.userName;
    //   }
      else {
          // alert("Hi");
      

        // console.log('Register User', JSON.stringify(self.register));
            // self.register.addresses[0].latitude = '22.586408';
            // self.register.addresses[0].longitude = '88.400107';
            // self.register.addresses[0].latitude = '22.58139428';
            // self.register.addresses[0].longitude = '88.36056187';
            // self.register.addresses[0].streetAddress = self.register.streetAddress + ', ' + self.register.streetAddress2;
            // self.register.addresses[0].contactPhone = self.register.phone;
            // var latitude = '22.586408';
            // var longitude = '88.400107'; 
            // var latitude = '22.596408';
            // var longitude = '88.390107';
        // console.log('Register User', self.register);
       
        LoginService.userRequest(self.register)
             .then(
             function successCallback(response) {
                 // console.log('User created successfully');
                 //var successMessage = 'User created successfully';
                 self.errorMessage ='';
                 // console.log('Register User', response);
                 $("#usercreated").text(response.data.message);
                 //$("#login").show();
                 // alert($scope.email_check_status);
                  if($scope.email_check_status == 0) {
                     // alert("Email id is alreday exist");
                     $("#error_email_show").html('<div class="alert alert-danger" role="alert">Email id is alreday exist </div>');
                  }
                   else{
                   $location.path( $rootScope.contextpath1 );/*
                   $location.path( "/yewmed/register" );*/
                   }
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

     }



     $scope.direct_login = function(x){
          if(x==1){
            self.user.userName = self.register.userName
            self.user.password = self.register.password;
             self.user.loginType='USER';
            LoginService.loginRequest(self.user)
            .then(
                function successCallback(response) {
                    $scope.msg = "";
                    $cookies.put('Token', response.headers('Authorization'));
                    $cookies.put('Status', 'Active');
                    $rootScope.statusCookie = 'Active';
                    $('#login-window').modal("hide");
                    localStorage.setItem("pswdForTeliMed", self.user.password)
                    getUserDetails(); // call for geting login user data with address
                    getWishList();
                    $route.reload();
                    self.cartItems = localStorage.getItem("cartLocalStorage");
                    if (localStorage.getItem("cartLocalStorage") != null) {
                        ProductDetailService.addBulkItemInCart(JSON.parse(localStorage.getItem("cartLocalStorage"))).then(
                            function successCallback(response) {
                                if (response != null) {
                                    localStorage.setItem("cartLocalStorage", JSON.stringify(response));
                                    $rootScope.totalitemsincart = response.length;
                                     if ($location.absUrl().split('/').pop() == "register") {
                                        $location.path($rootScope.contextpath1);
                                      }  

                                    $route.reload();
                                }
                            },
                            function error(response) {
                                
                            }

                        );


                    } 
                    else {
                        callCart();
                    }

                },
                function error(response) {
                      $scope.msg = "Sorry you provided wrong Password or Emailid.";

                }
            );

          }
          else{
                $location.path( $rootScope.contextpath1 );
          }
     }



      self.viewGroupWiseProducts = function(id , grpname, catename,cateid) {
         //alert("id: "+id);
        // alert("Group Name :" + grpname);
        // alert("Category Name :" + catename);
        document.getElementById("mySidenav").style.width = "0";
        $('.mobile_view_opacity').css({"opacity":"1"});
        $scope.grp_name = grpname;
        $scope.cate_name = catename;
    // window.localStorage.setItem("groupId",id);
    // window.localStorage.setItem("grpname",grpname);
    // window.localStorage.setItem("catename",catename);
    // window.localStorage.setItem("cateid",cateid);
     if($location.path() == $rootScope.contextpath+"/groups"+"/"+catename+"/"+grpname+"-"+id) {
      $route.reload();
       } else {
        //alert("hello");
      $location.path( $rootScope.contextpath+"/groups"+"/"+catename+"/"+grpname+"-"+id);
    }
  }
// var groupId = window.localStorage.getItem("groupId");
// $scope.grp_name = window.localStorage.getItem("grpname");
// $scope.cate_name = window.localStorage.getItem("catename");
// $scope.cate_id = window.localStorage.getItem("cateid");


var current_url = window.location.href;
//alert(current_url);
var urlspltby_dash = current_url.split("/");
var urlspltby_dash_length = urlspltby_dash.length;
var groupId = urlspltby_dash[urlspltby_dash_length-1].split("-")[1];
 // $scope.grp_name = urlspltby_dash[urlspltby_dash_length-1].split("-")[0];
 // $scope.cate_name = urlspltby_dash[urlspltby_dash_length-2];

 if (groupId>0) {
 //self.viewGroupWiseProducts = function(id) {
         //alert("groupId: "+groupId); 
        //$http.get(serverurl+"/items/details/group/"+groupId+"?page="+1+"&limit=20")
        $http.get(serverurl+"/items/details/groupNew/"+groupId+"?page="+1+"&limit=20")
         .then(
         function (response) {
           // console.log("viewGroupWiseProducts: "+JSON.stringify(response.data))
           self.itemGroupWise = response.data.items;
           //alert(response.data.categoryId);
            //if(response.data.length>0){
            $scope.grp_name = response.data.name;
            $scope.cate_name = response.data.categoryName;
            $scope.cate_id = response.data.categoryId;
           //}
           // else {
            
           // }
           var groups_product_div_height = 0;
           $timeout(function() {
        
        $('.groups_product_div_div').each(function() { 
            // alert("lasetsheight_p"+ lasetsheight_p);
             if ($(this).height() > groups_product_div_height) {
                groups_product_div_height = $(this).height();    
                // alert(groups_product_div_height);       
             }     
          });
        $('.groups_product_div_div').height(groups_product_div_height);
      }, 200);
           // $scope.order = '-name';
         },
         function(errResponse){
         }
      );
    }


    // $scope.gotoCategory = function(){
    //         $location.path( "/yewmed/category");
    //      }





// ................coming from cart controller ......................


}]);