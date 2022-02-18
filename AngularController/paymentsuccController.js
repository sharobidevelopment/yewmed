'use strict';
angular.module('myApp').controller('paymentsuccController', ['$http', '$scope', '$rootScope', '$location', '$route' , 'CheckoutService', 'CartService', '$timeout', '$cookies','$routeParams', 'CommonService' , 'LoginService' , function($http, $scope, $rootScope, $location, $route , CheckoutService, CartService, $timeout, $cookies,$routeParams, CommonService, LoginService) {
    var self = this;

    // $scope.onloadFun = function(){
    // 	 alert("Hi");
    // }

    //$("#2nddiv").hide();

    $scope.paymentobj = {};
    $scope.weburi = $location.absUrl();
    $scope.status = $scope.weburi.split("?")[1].split("&");
   // alert($scope.parameters);

    // for(var i=0;i<$scope.parameters.length;i++){
    // 	if($scope.parameters[i].split("=")[0]=="CURRENCY"){
    // 		$scope.paymentobj.CURRENCY = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="GATEWAYNAME"){
    // 		$scope.paymentobj.GATEWAYNAME = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="RESPMSG"){
    // 		$scope.paymentobj.RESPMSG = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="BANKNAME"){
    // 		$scope.paymentobj.BANKNAME = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="PAYMENTMODE"){
    // 		$scope.paymentobj.PAYMENTMODE = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="TXNID"){
    // 		$scope.paymentobj.TXNID = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="ORDERID"){
    // 		$scope.paymentobj.ORDERID = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="BANKTXNID"){
    // 		$scope.paymentobj.BANKTXNID = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="TXNAMOUNT"){
    // 		$scope.paymentobj.TXNAMOUNT = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="STATUS"){
    // 		$scope.paymentobj.STATUS = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="TXNDATE"){
    // 		$scope.paymentobj.TXNDATE = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="RESPCODE"){
    // 		$scope.paymentobj.RESPCODE = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="CHECKSUMHASH"){
    // 		$scope.paymentobj.CHECKSUMHASH = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else if($scope.parameters[i].split("=")[0]=="MID"){
    // 		$scope.paymentobj.MID = $scope.parameters[i].split("=")[1]
    // 	}
    // 	else{
    		
    // 	}
    // }

    // console.log(JSON.stringify($scope.paymentobj));
    // var tokenCookie = $cookies.get('Token');
    //alert(tokenCookie);

     //     $http.post(serverurl+"/orders/pgResponseNew",$scope.paymentobj,{
     //             headers:{'Authorization': tokenCookie}
     //      })
     //   .then(
     //   function (response) {
         
     //   		if(response.data.status==1.0){
     //             $("#msg_show").html(response.data.message);
     //             $("#msg_show").css("color", "green");
    	// 		 $("#2nddiv").show();
    	// 		 $("#1stdiv").hide();    			                  
     //   		}
     //   		else if(response.data.status==2.0){
     //             $("#msg_show").html(response.data.message);
     //             $("#msg_show").css("color", "red");
     //             $("#2nddiv").show();
    	// 		 $("#1stdiv").hide();
     //   		}
     //   		else{
     //             $("#msg_show").html(response.data.message);
     //             $("#msg_show").css("color", "red");
     //             $("#2nddiv").show();
    	// 		 $("#1stdiv").hide();       			
     //   		}

     //   },
     //   function(errResponse){
     //      console.error("errResponse:"+'Error while adding users updateAddress');
     //   }
     // );


       if(response.data.status==1){
                 $("#msg_show").html("Payment Successful");
                 $("#msg_show").css("color", "green");
    			 // $("#2nddiv").show();
    			 // $("#1stdiv").hide();    			                  
       		}
       		else if(response.data.status==2){
                 $("#msg_show").html("Payment Failed");
                 $("#msg_show").css("color", "red");
                // $("#2nddiv").show();
    			 //$("#1stdiv").hide();
       		}
       		else{
                 $("#msg_show").html("Checksum Mismatched");
                 $("#msg_show").css("color", "red");
                // $("#2nddiv").show();
    			 // $("#1stdiv").hide();       			
       		}



}]);    