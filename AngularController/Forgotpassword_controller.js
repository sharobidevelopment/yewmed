'use strict';

angular.module('myApp').controller('ForgotpasswordController', ['$scope','$http','$route','ForgotpasswordService','$location','$timeout', '$rootScope' , function($scope,$http,$route,ForgotpasswordService,$location,$timeout,$rootScope) {
//angular.module('myApp').controller('UserController', ['$scope', function($scope) {
	// alert('hi');
    var self = this;
    // $scope.eml_add = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
     $scope.weburi = $location.absUrl();
     $scope.currentToken = $scope.weburi.split("=")[1];
     // alert($scope.currentToken);
     self.forgot={};
     self.forgotpasswordSubmit = forgotpasswordSubmit;
     $scope.confirm_pswd_check_value = '';
     $scope.showPassword = false;
     $scope.showconPassword = false;

     // alert("Hi");
     $(".ng-not-empty").val("");


   function forgotpasswordSubmit(){
          
         self.forgot.resetToken= $scope.currentToken; 
         // console.log("forgot:: ",self.forgot);
         // console.log("forgot:: "+JSON.stringify(self.forgot));
         $http.post(serverurl+"/mail/reset",self.forgot)
             .then(
             function (response) {
               // console.log("response:"+JSON.stringify(response.data));
               // alert("succesfully changed");
               $location.path( $rootScope.contextpath1 );
               $('#login-window').modal("show");
             },
             function(errResponse){
                console.error("errResponse:"+JSON.stringify(errResponse.data.message));
                alert(errResponse.data.message);
                // $('#reset_pswd_error').html(errResponse.data.message);
                // $timeout(function() {
                //     $('#reset_pswd_error').html("");
                // }, 4000);
             }
         );
         // $scope.succMsg = "Succesfully Submitted You will get a confirmation mail to your Mail Id";
         // self.forgot={};
         // $scope.forgotForm.$setPristine();
         // $scope.forgotForm.$setUntouched();
         // $timeout(function() {
         //            $scope.succMsg = '';
         //        }, 6000);


      // ForgotpasswordService.createForgotpassword(self.forgot)
      //        .then(
      //        function successCallback(response) {
      //            console.log('User created successfully');
      //            //var successMessage = 'User created successfully';
      //            console.log('Forgot Pasword', response);
      //            $("#usercreated").text(response.data.message);
      //          $("#login").show();
      //          $location.path( "/yewmed/" );
      //       },  
      //        function error(response) {
      //        console.error('Error while changing password form');
      //        self.errorMessage = 'Error while creating User: ' + response.data.message;
      //        self.successMessage='';
            
                    
      //         }
              
             
      //    );
     }




      $scope.passwordCheck = function() {
      var pswrd = $("#password").val();

      var confirm_pswrd = $("#confirmpassword").val();
      // alert(confirm_pswrd.length);
      if(confirm_pswrd.length>0) {
      if(confirm_pswrd != pswrd ){
         $("#check_pswrd_match").html("Password not match").css("color", "red");
         $("#resetpswd_button_id").prop('disabled', true);
         $scope.confirm_pswd_check_value = 'false';
      }
      else{
         $("#check_pswrd_match").html("Password match").css("color", "green");
         $("#resetpswd_button_id").prop('disabled', false);
         $scope.confirm_pswd_check_value = 'true';
      }
    }
    else {
          $("#check_pswrd_match").html("");
    }
   }


   $scope.toggleShowPassword = function() {
    $scope.showPassword = !$scope.showPassword;
  }

  $scope.toggleShowconPassword = function() {
    $scope.showconPassword = !$scope.showconPassword;
  }



}]);



// add forgotpassword service after route