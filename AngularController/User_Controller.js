

'use strict';

angular.module('myApp').controller('UserController', ['$scope','$http','$cookies','$location','$interval','UserService','Idle','Keepalive','$route','ProductDetailService','$rootScope', function($scope,$http,$cookies,$location,$interval,UserService,Idle, Keepalive,$route,ProductDetailService,$rootScope) {
//angular.module('myApp').controller('UserController', ['$scope', function($scope) {
    var self = this;
    //self.register={};
     self.register={addresses:[]};
    //self.register={fname:'',lname:'',dob:'',gender:'',contactPhone:'',email:'',password:'',streetAddress:'',countryId:'',stateId:'',city:'',pincode:'',landmark:'',type:''};
     
    self.userSubmit = userSubmit;
    userAuthorizationChecked();
    self.successMessage = '';
    self.errorMessage = '';
    $scope.countries=[];
    $scope.states=[];
    $scope.cities=[];
    $scope.email_check_for_undefined = '';
    $scope.email_check_status = 1;
    $scope.currentDate1 = new Date();
    $scope.showPassword = false;
    var currentDate = new Date();
    var dd = currentDate.getDate();
    var yyyy = currentDate.getFullYear()-10;
    var mm = currentDate.getMonth()+1;
    if(mm<10){mm='0'+mm;}
    $scope.maxDate = yyyy + '-' + mm + '-' + dd;
    $scope.maxDate1 = dd + '/' + mm + '/' + yyyy;
    $scope.confirm_pswd_check_value = '';
// $(function() {
//             $("#dob").datepicker({
//                dateFormat: 'yy-mm-dd' 
//             });
//          });



   // alert("Hi");
    $(".ng-not-empty").val("");
    $("#email").val(" ");
    $("#password").val(" ");


   function userAuthorizationChecked(){
    // alert("userChecked");
      var tokenCookie = $cookies.get('Token');
      // alert(tokenCookie);
    //console.log("tokenCookie userChecked found:"+tokenCookie)
      if(tokenCookie != '' && tokenCookie !=undefined){
      $location.path( $rootScope.contextpath);
    }
  }

   
//-------------------------------------FOR USER REGISTRATION START---------------------------------------------------------------------------
   

   $scope.passwordCheck = function() {
      var pswrd = $("#password").val();

      var confirm_pswrd = $("#confirmpassword").val();
      if(confirm_pswrd != '') {
      if(confirm_pswrd != pswrd ){
         $("#check_pswrd_match").html("password not match").css("color", "#cc4749");
         $("#register_button_id").prop('disabled', true);
         $scope.confirm_pswd_check_value = 'false';
      }
      else{
         $("#check_pswrd_match").html("password match").css("color", "green");
         $("#register_button_id").prop('disabled', false);
         $scope.confirm_pswd_check_value = 'true';
      }
    }
    else {

    }
   }




   function userSubmit(){
     //alert("Register::"+self.register);
    self.register.userName = self.register.email;
        //console.log('Register User', JSON.stringify(self.register));
            // self.register.addresses[0].latitude = '22.586408';
            // self.register.addresses[0].longitude = '88.400107';
            // self.register.addresses[0].latitude = '22.58139428';
            // self.register.addresses[0].longitude = '88.36056187';
            self.register.addresses[0].streetAddress = self.register.streetAddress + ', ' + self.register.streetAddress2;
            self.register.addresses[0].contactPhone = self.register.phone;
            // var latitude = '22.586408';
            // var longitude = '88.400107'; 
            var latitude = '22.596408';
            var longitude = '88.390107';
        //console.log('Register User', self.register);
       
        UserService.userRequest(self.register)
             .then(
             function successCallback(response) {
                 //console.log('User created successfully');
                 //var successMessage = 'User created successfully';
                 self.errorMessage ='';
                 //console.log('Register User', response);
                 $("#usercreated").text(response.data.message);
                 //$("#login").show();
                 // alert($scope.email_check_status);
                  if($scope.email_check_status == 0) {
                     // alert("Email id is alreday exist");
                     $("#error_email_show").html('<div class="alert alert-danger" role="alert">Email id is alreday exist </div>');
                  }
                   else{
                   $location.path( $rootScope.contextpath );/*
                   $location.path( "/yewmed/register" );*/
                   }
            },  
             function error(response) {
             //console.error('Error while creating User');
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
                 //console.error('Error while creating User');
             }*/
         );
     }
   
   $scope.resetRegister = function(){
     //alert("resetRegister::"+self.register);
     //self.register={fname:'',lname:'',dob:'',gender:'',contactPhone:'',email:'',password:'',streetAddress:'',countryId:'',stateId:'',city:'',pincode:'',landmark:'',type:''};
       self.register={addresses:[]};
        $scope.registerForm.$setPristine();
        $scope.registerForm.$setUntouched();
      }
//-------------------------------------FOR USER REGISTRATION END----------------------------------------------------
//-------------------------------------FOR USER EMAIL CHECK START----------------------------------------------------
  /* $scope.checkEmail = function() {
   alert("checkEmail:"+self.register.email);
    var x = document.getElementById("email");
     x.value = x.value.toUpperCase();
       }*/
$scope.checkEmail = function() {
   //alert("checkEmail:"+self.register.email);
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
    $http.get(serverurl+"/users/checkEmail?email="+self.register.email)
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         //console.log("status:"+JSON.stringify(response.status));
         //console.log(self.register.email);
         $scope.email_check_for_undefined = self.register.email;
         $scope.msgEmail=response.data.message;
         $scope.email_check_status = response.data.status;
         //console.log("status:"+$scope.email_check_status);
         // alert($scope.email_check_status);
        // $scope.users={};
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while fetching email');
         //console.log("status:"+JSON.stringify(errResponse.status));
          $scope.msgEmail=errResponse.data.message;
           
       },
       /* window.setTimeout(function () {
           $(".alert-success").fadeTo(500, 0).slideUp(500, function () {
             $(this).remove(); 
          });
             }, 5000)*/

        window.setTimeout(function(){
            //$("#success-alert").hide();
              $("#success-alertEmail").fadeTo(2000, 500).slideUp(500, function(){
               $("#success-alertEmail").slideUp(500);
               
                }); 
           })
   );
   }
   //-------------------------------------FOR USER EMAIL CHECK END----------------------------------------------------
   


//-----------------------------For Country Start----------------------------------------------------------------
$http.get(serverurl+"/addresses/countries")
       .then(
       function (response) {
           //alert("response"+$scope.countries);
         //console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.countries=response.data;
       },
       function(errResponse){
          // alert("errResponse"+response.data.message);
        //console.error("errResponse:"+'Error while fetching countries.');
       }
    );
 //-----------------------------For Country End----------------------------------------------------------------

  //-----------------------------For States Starts----------------------------------------------------------------
$scope.getStates = function() {
   //alert("getStates: "+self.register.addresses[0].countryId);
    $http.get(serverurl+"/addresses/countries/"+self.register.addresses[0].countryId+"/states")
       .then(
       function (response) {
        // alert("response"+response.data);
         //console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.states=response.data;
       },
       function(errResponse){
          //alert("errResponse"+response.data);
          $scope.states=response.data;
        //console.error("errResponse:"+'Error while fetching states.');
       }
   );
};
//-----------------------------For States End----------------------------------------------------------------
//-----------------------------For States End----------------------------------------------------------------
$scope.getCities= function() {
   //alert("getStates1: "+self.register.addresses[0].stateId);
    $http.get(serverurl+"/addresses/states/"+self.register.addresses[0].stateId+"/cities")
       .then(
       function (response) {
           //alert("response"+$scope.cities);
         //console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.cities=response.data;
       },
       function(errResponse){
           //alert("errResponse"+response.data);
        //console.error("errResponse:"+'Error while fetching cities.');
       }
    );
 }

//-----------------------------For States End----------------------------------------------------------------


// ..............................For Login Popup.......................................................

$scope.closeLoginWindow = function() {
        //$("#login-window").hide();
        $('#login-window').modal("hide");
        window.location = $rootScope.contextpath+"/register";
    }
    $scope.openLoginWindow = function() {
        //$("#login").show();
        $('#login-window').modal("show");

    }

 // ..............................For Login Popup End.......................................................   

   /*--------------------------------------------------------------------------------------*/

   $scope.toggleShowPassword = function() {
    $scope.showPassword = !$scope.showPassword;
  }
   
}]);





