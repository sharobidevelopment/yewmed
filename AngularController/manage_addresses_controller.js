'use strict';

var app = angular.module('myApp')
app.controller('ManageaddressesController', ['$filter','$scope','$cookies','$http','$location','CommonService','$rootScope', function($filter,$scope,$cookies,$http,$location,CommonService,$rootScope) {
//angular.module('myApp').controller('ProfileController', function ($scope) {
    var self = this;
    userAuthorizationChecked();
    $scope.oneAtATime = true;
    $scope.oneDefaultChecked = true;

    $scope.selectedaddress={};
    $scope.users={};
    $scope.newaddress={};
    $scope.countries=[];
    $scope.states=[];
    $scope.cities=[];
    $scope.users.password='';
    callCountries();
    $scope.adress_update_chng = 0;

    

    // alert("Hi");
    $(".ng-not-empty").val("");

    $scope.selectedaddress = JSON.parse(localStorage.getItem("EditAddressData"));
    $scope.divFind = JSON.parse(localStorage.getItem("div_find_dup"));

    if($scope.divFind ==2){
      getStatesForSetAddress();
      getCitiesForSetAddress();
    }


function userAuthorizationChecked(){
    //alert("userChecked");
      var tokenCookie = $cookies.get('Token');
    // console.log("tokenCookie userChecked found:"+tokenCookie)
     if(tokenCookie=='' || tokenCookie==undefined){
      $location.path( $rootScope.contextpath1);
    }
  }
   /*$scope.statusCookie = $cookies.get('Status');
    if ($scope.statusCookie === undefined) {
        $scope.statusCookie = 'Deactive';
    }*/
    
function reset () {
      $("#toggleCSS").attr("href", "themes/alertify.default.css");
      alertify.set({
        labels : {
                  ok     : "OK",
                  cancel : "Cancel"
                  },
        delay : 5000,
        buttonReverse : false,
        buttonFocus   : "ok"
      });
    }
//-----------------------------For States End----------------------------------------------------------------

//-----------------------------For addAddress start----------------------------------------------------------------
$scope.addAddress = function() {
        var tokenCookie = $cookies.get('Token');
    var newAddressNo = $scope.address.length + 1;
    $scope.address.push('address ' + newAddressNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
//-----------------------------For addAddress End----------------------------------------------------------------



//-----------------------------For getUser start----------------------------------------------------------------
$scope.getUser= function() {
   //alert("getAllAddress");
    var tokenCookie = $cookies.get('Token');
    // console.log("tokenCookie found:"+tokenCookie)
     $http.get(serverurl+"/users/details",{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response Users:"+JSON.stringify(response.data))
         $scope.users=response.data;
         /*for (var i = $scope.users.addresses.length - 1; i >= 0; i--) {
            console.log("id = "+$scope.users.addresses[i].id + " val = "+$scope.users.addresses[i].isDefault)
              if($scope.users.addresses[i].isDefault==1)
                $scope.users.addresses[i].isDefault=true;
              else
                $scope.users.addresses[i].isDefault=false;
           }*/
       },
       function(errResponse){
          console.error("errResponse:"+'Error while fetching users details');
           
       }
   );
 }
//-----------------------------For getUser End----------------------------------------------------------------

//-----------------------------For updateAddress start----------------------------------------------------------------
/*$scope.updateAddress = function(i) {
   alert("updateAddress");
    var tokenCookie = $cookies.get('Token');
    console.log("tokenCookie found:"+tokenCookie)
    console.log("update address = "+ JSON.stringify($filter('filter')($scope.users.addresses, {'id':i})))
    $http.post(serverurl+"/addresses",$filter('filter')($scope.users.addresses, {'id':i})[0],{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         console.log("response:"+JSON.stringify(response.data));
         $scope.getUser();
         $scope.newAddress={};
       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users address');
       }
   );
   }*/
//-----------------------------For updateAddress End----------------------------------------------------------------
//-----------------------------For updateAddress start----------------------------------------------------------------

$scope.updt_add_chng = function(){
    $scope.adress_update_chng = 1;
}


$scope.updateAddress = function() {
  //alert("updateAddress: "+$scope.selectedaddress);
    var tokenCookie = $cookies.get('Token');

    if($scope.adress_update_chng == 0){
        $location.path( $rootScope.contextpath+"/manageaddress");
    }
    else{
    // console.log("tokenCookie found:"+tokenCookie);
    // console.log("update address = "+ JSON.stringify($scope.selectedaddress));
     $http.post(serverurl+"/addresses",$scope.selectedaddress,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response:"+JSON.stringify(response.data));
         $scope.selectedaddress = response.data;
         //$scope.newAddress={};
         /*$scope.addressEditForm.$setPristine();
         $scope.addressEditForm.$setUntouched();*/
         // $('#addresseditmodal').modal('hide');
         $location.path( $rootScope.contextpath+"/manageaddress");
         $scope.getUser();
         $scope.adress_update_chng = 0;
       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users updateAddress');
          $scope.adress_update_chng = 0;
       }
   );
   }
   }
//-----------------------------For updateAddress End----------------------------------------------------------------

//-----------------------------For addNewAddress start----------------------------------------------------------------
$scope.addNewAddress = function() {
   //alert("addNewAddress"+JSON.stringify($scope.newaddress));
    var tokenCookie = $cookies.get('Token');
    console.log('newaddress User', JSON.stringify($scope.newaddress));
            // $scope.newaddress.latitude = '22.586408';
            // $scope.newaddress.longitude = '88.400107';
            // var latitude = '22.586408';
            // var longitude = '88.400107';
    // console.log("tokenCookie found:"+tokenCookie)
    // console.log("$scope.newAddress:"+JSON.stringify($scope.newaddress));

    $http.post(serverurl+"/addresses",$scope.newaddress,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response:"+JSON.stringify(response.data));
         $scope.getUser();
         $scope.newaddress={};
         $location.path( $rootScope.contextpath+"/manageaddress");
         //$('#addressaddmodal').modal('hide');
       },
       function(errResponse){
          console.error("errResponse:"+'Error while adding users newAddress');
       }
   );
   }
//-----------------------------For addNewAddress End----------------------------------------------------------------


//-----------------------------For callCountries Start----------------------------------------------------------------
function callCountries(){
$http.get(serverurl+"/addresses/countries")
       .then(
       function (response) {
           //alert("response"+$scope.countries);
         // console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.countries=response.data;
       },
       function(errResponse){
          // alert("errResponse"+response.data.message);
        console.error("errResponse:"+'Error while fetching countries.');
       }
    );
   }    
//-----------------------------For callCountries End----------------------------------------------------------------

//-----------------------------For States Starts----------------------------------------------------------------
/*$scope.getStates = function() {
   alert("getStates: "+$scope.newaddress.addresses[0].countryId);
    $http.get(serverurl+"/addresses/countries/"+$scope.newaddress.addresses[0].countryId+"/states")
       .then(
       function (response) {
        // alert("response"+response.data);
         console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.states=response.data;
       },
       function(errResponse){
          //alert("errResponse"+response.data);
          $scope.states=response.data;
        console.error("errResponse:"+'Error while fetching states.');
       }
   );
};*/
$scope.getStates = function(param) {
     $scope.adress_update_chng = 1;
     $scope.parameter='';
     if(param=='1'){
      //alert("param::"+param);
      //alert("param countryId::"+$scope.newaddress.countryId);
       $scope.parameter=$scope.newaddress.countryId;
     }
     if(param=='2'){
      //alert("param::"+param);
      //alert("param countryId::"+$scope.selectedaddress.countryId);
        $scope.parameter=$scope.selectedaddress.countryId;
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
 function getStatesForSetAddress(){
//$scope.getStatesForSetAddress = function() {
  // alert("getStatesForSetAddress: ");
  CommonService.getStateList($scope.selectedaddress.countryId)
            .then(
                function successCallback(response) {
                  $scope.states=response;
                  //console.log("$scope.states: "+$scope.states);
                },
                function error(response) {
                    console.log("Error Occoured In Fetching States");
                }
            );
 };
//-----------------------------For States End----------------------------------------------------------------


//-----------------------------For getCities Starts----------------------------------------------------------------
/*$scope.getCities= function() {
   alert("getStates1: "+$scope.newaddress.addresses[0].stateId);
    $http.get(serverurl+"/addresses/states/"+$scope.newaddress.addresses[0].stateId+"/cities")
       .then(
       function (response) {
           //alert("response"+$scope.cities);
         console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.cities=response.data;
       },
       function(errResponse){
           //alert("errResponse"+response.data);
        console.error("errResponse:"+'Error while fetching cities.');
       }
    );
 }*/
$scope.getCities= function(param) {
 /*alert("getCities::"+param);*/
 $scope.adress_update_chng = 1;
  $scope.parameter='';
     if(param=='1'){
        //alert("param::"+param);
        //alert("param stateId::"+$scope.newaddress.stateId);
       $scope.parameter=$scope.newaddress.stateId;
     }
     if(param=='2'){
       //alert("param::"+param);
       //alert("param stateId::"+$scope.selectedaddress.stateId);
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

 function getCitiesForSetAddress(){
 // $scope.getCitiesForSetAddress= function() {
  //alert("getCitiesForSetAddress: ");
  CommonService.getCityList($scope.selectedaddress.stateId)
            .then(
                function successCallback(response) {
                  $scope.cities=response;
                  //console.log("$scope.cities: "+$scope.cities);
                },
                function error(response) {
                    console.log("Error Occoured In Fetching Cities");
                }
            );
 };
//-----------------------------For getCities End----------------------------------------------------------------

//-----------------------------For makeDefault check start----------------------------------------------------------------
$scope.makeDefault= function(id) {
   //alert("checkedDefault: "+id+" length: "+$scope.users.addresses.length);
    var tokenCookie = $cookies.get('Token');
   //if($scope.users.addresses[id]==1)
   for (var i = $scope.users.addresses.length - 1; i >= 0; i--) {
    // console.log("id = "+$scope.users.addresses[i].id + " val = "+$scope.users.addresses[i].isDefault)
     if($scope.users.addresses[i].id==id) {
       //alert("isDefault: "+$scope.users.addresses[i].id);

       $http.post(serverurl+"/addresses/makedefault",{id},{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
           //alert("response: "+response.data.message);
            // console.log("status:"+JSON.stringify(response.data.status));
            //$scope.msgEmail=response.data.message;
       },
       function(errResponse){
           //alert("errResponse"+errResponse.data.message);
           // console.log("status:"+JSON.stringify(errResponse.data.status));
           // console.log("message:"+JSON.stringify(errResponse.data.message));
            //$scope.msgMakeDefault=response.data.message;
       }
    );
      $scope.users.addresses[i].isDefault=1;
     } else {
      $scope.users.addresses[i].isDefault = 0;
       //alert("isDefault: '0' : "+$scope.users.addresses[i].id);
     }
   }
 }
//-----------------------------For makeDefault check end----------------------------------------------------------------

$scope.getUser();
}]);
