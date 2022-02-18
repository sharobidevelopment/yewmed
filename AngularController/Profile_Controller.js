'use strict';

var app = angular.module('myApp')
app.controller('ProfileController', ['$filter','$scope','$cookies','$http','$location','CommonService', '$route','$rootScope', function($filter,$scope,$cookies,$http,$location,CommonService,$route,$rootScope) {
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
    $scope.name_chng_toogle = 0;
    $scope.email_chng_toogle = 0;
    $scope.change_button = "namechange";
    $("#update_password").hide();
    $("#button_password").hide();
    $("#update_email").hide();
    $("#button_email").hide();
    $("#button_password1").hide();
    $("#button_email1").hide();

    $("#change2").click(function(){
      $('#change1').prop('checked', false);
       $("#update_email").hide();
       $("#button_email").hide();
       $("#button_email1").hide();
      if($("#change2").prop('checked') == true){
         $("#update_password").show();
         $("#button_password").show();
         $("#button_password1").show();
         $("#button_name").hide();
         $("#button_name1").hide();
         $('#fname').prop('readonly', true);
         $('#lname').prop('readonly', true);
      }
      else{
        $("#update_password").hide();
        $("#button_password").hide();
        $("#button_password1").hide();
        $("#button_name").show();
        $("#button_name1").show();
        $('#fname').prop('readonly', false);
        $('#lname').prop('readonly', false);
      }
    });


    $("#change1").click(function(){
        $('#change2').prop('checked', false);
        $("#update_password").hide();
        $("#button_password").hide();
        $("#button_password1").hide();
      if($("#change1").prop('checked') == true){
         $("#update_email").show();
         $("#button_email").show();
         $("#button_email1").show();
         $("#button_name").hide();
         $("#button_name1").hide();
         $('#fname').prop('readonly', true);
         $('#lname').prop('readonly', true);
      }
      else{
        $("#update_email").hide();
        $("#button_email").hide();
        $("#button_email1").hide();
        $("#button_name").show();
        $("#button_name1").show();
        $('#fname').prop('readonly', false);
        $('#lname').prop('readonly', false);
      }
     }); 

    // alert("Hi");
    $(".ng-not-empty").val("");
    

function userAuthorizationChecked(){
    //alert("userChecked");
      var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie userChecked found:"+tokenCookie)
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

//-----------------------------For updateName start----------------------------------------------------------------

$scope.updt_name_chng = function(){
      $scope.name_chng_toogle =1;   
}

$scope.updateName = function() {
  $scope.newName={"fname":$scope.users.fname,"lname":$scope.users.lname};
   //alert("updateName:"+$scope.newName.fname+" "+$scope.newName.lname);
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
    //console.log("newName:"+$scope.newName)

    if($scope.name_chng_toogle==0){
         $scope.msgName="Name changed successfully";
                window.setTimeout(function(){
            //$("#success-alert").hide();
              $("#success-alertName").fadeTo(2000, 500).slideUp(500, function(){
                 $("#success-alertName").slideUp(500);
              });
              $("#success-alertName1").fadeTo(2000, 500).slideUp(500, function(){
                 $("#success-alertName1").slideUp(500);
              });    
           })
    }
    else{
    $http.post(serverurl+"/users/updateName",$scope.newName,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         $scope.msgName="Name changed successfully";
         $scope.name_chng_toogle =0;
        // $scope.users={};
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while update users name');
         $scope.msgName="Error while update users name";
         $scope.name_chng_toogle =0;  
       },
       window.setTimeout(function(){
            //$("#success-alert").hide();
              $("#success-alertName").fadeTo(2000, 500).slideUp(500, function(){
                 $("#success-alertName").slideUp(500);
              });
              $("#success-alertName1").fadeTo(2000, 500).slideUp(500, function(){
                 $("#success-alertName1").slideUp(500);
              });    
           })
        );
    }
   }

//-----------------------------For updateName End----------------------------------------------------------------

//-----------------------------For updatePassword start----------------------------------------------------------------
$scope.updatePassword = function() {
  $scope.msgPassword= '';
  $scope.passStyle= ''; 
  $scope.newPass={"password":$scope.users.oldPassword,"newPassword":$scope.users.newPassword};
  // alert("updatePassword:"+$scope.newPass.password+" "+$scope.newPass.newPassword);
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
    //console.log("newPass:"+$scope.newPass)

    $http.post(serverurl+"/users/updatePassword",$scope.newPass,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         //console.log("status:"+JSON.stringify(response.status));
         $scope.msgPassword="Password changed successfully";
         $scope.passStyle="color:green";
        // $scope.users={};
        $scope.updateForm.$setPristine();
        $scope.updateForm.$setUntouched();
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while update users password');
         //console.log("status:"+JSON.stringify(errResponse.status));
          $scope.msgPassword="Invalid old credentials";
          $scope.passStyle="color:red"; 
       },
       /* window.setTimeout(function () {
           $(".alert-success").fadeTo(500, 0).slideUp(500, function () {
             $(this).remove(); 
          });
             }, 5000)*/

        window.setTimeout(function(){
            //$("#success-alert").hide();
              
              $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").slideUp(500);
              }); 
              $("#success-alert1").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert1").slideUp(500);
              }); 
           })


   );
   }
//-----------------------------For updatePassword End----------------------------------------------------------------


//-----------------------------For updatePhone start----------------------------------------------------------------
$scope.updatePhone = function() {
  $scope.msgPhone = '';
  $scope.msgPhoneStyle = '';
  $scope.newPhone={"password":$scope.users.password,"phone":$scope.users.phone};
  // alert("updatePhone:"+$scope.newPhone.password+" "+$scope.newPhone.phone);
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
    //console.log("newPhone:"+$scope.newPhone)

    $http.post(serverurl+"/users/updatePhone",$scope.newPhone,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         //console.log("status:"+JSON.stringify(response.status));
         $scope.msgPhone="Phone changed successfully";
         $scope.msgPhoneStyle = "color:green";
        // $scope.users={};
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while update users phone');
         //console.log("status:"+JSON.stringify(errResponse.status));
          $scope.msgPhone="Invalid credentials";
          $scope.msgPhoneStyle = "color:red"; 
       },
       /* window.setTimeout(function () {
           $(".alert-success").fadeTo(500, 0).slideUp(500, function () {
             $(this).remove(); 
          });
             }, 5000)*/
        window.setTimeout(function(){
            //$("#success-alert").hide();
              $("#success-alertPhone").fadeTo(2000, 500).slideUp(500, function(){
               $("#success-alertPhone").slideUp(500);
                }); 
           })
   );
}


$scope.$on('ngRepeatFinished1', function(ngRepeatFinishedEvent) {
  var moving_div_height = 0;
$('.manage_address_show_div').each(function() { 
             if ($(this).height() > moving_div_height) {
                moving_div_height = $(this).height();             
             }     
          });
        $('.manage_address_show_div').height(moving_div_height);
  });      



//-----------------------------For updatePhone End----------------------------------------------------------------


//-----------------------------Update Email Address--------------------------------------------------------


$scope.updt_email_chng = function(){
     $scope.email_chng_toogle =1;
}

$scope.updateEmail = function() {
   $scope.msgEmail = '';
  // $scope.msgPhoneStyle = '';
  $scope.newEmail={"password":$scope.users.Password,"email":$scope.users.email};
  // alert("updatePhone:"+$scope.newPhone.password+" "+$scope.newPhone.phone);
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
    //console.log("newEmail:"+JSON.stringify($scope.newEmail));

    if($scope.email_chng_toogle ==0){
         $scope.msgEmail="Email changed successfully";
         $scope.msgPhoneStyle = "color:green";
        window.setTimeout(function(){
            //$("#success-alert").hide();
              $("#success-alertEmail").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alertEmail").slideUp(500);
              });
              $("#success-alertEmail1").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alertEmail1").slideUp(500);
              }); 
           })         
    }
    else{
    $http.post(serverurl+"/users/updateEmail",$scope.newEmail,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         //console.log("status:"+JSON.stringify(response));
         $scope.msgEmail="Email changed successfully";
         $scope.msgPhoneStyle = "color:green";
         $scope.email_chng_toogle =0;
        // $scope.users={};
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while update users phone');
         //console.log("status:"+JSON.stringify(errResponse));
          $scope.msgEmail="Email already exist.";          
          $scope.msgPhoneStyle = "color:red"; 
          $scope.email_chng_toogle =0;
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
              $("#success-alertEmail1").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alertEmail1").slideUp(500);
              }); 
           })
   );
  }
}

//-----------------------------Update Email Address End--------------------------------------------------------

//-----------------------------For getUser start----------------------------------------------------------------
$scope.getUser= function() {
   //alert("getAllAddress");
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
     $http.get(serverurl+"/users/details",{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         // console.log("response Users:"+JSON.stringify(response.data))
         $scope.users=response.data;
         /*for (var i = $scope.users.addresses.length - 1; i >= 0; i--) {
            //console.log("id = "+$scope.users.addresses[i].id + " val = "+$scope.users.addresses[i].isDefault)
              if($scope.users.addresses[i].isDefault==1)
                $scope.users.addresses[i].isDefault=true;
              else
                $scope.users.addresses[i].isDefault=false;
           }*/
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while fetching users details');
           
       }
   );
 }
//-----------------------------For getUser End----------------------------------------------------------------

//-----------------------------For updateAddress start----------------------------------------------------------------
/*$scope.updateAddress = function(i) {
   alert("updateAddress");
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie)
    //console.log("update address = "+ JSON.stringify($filter('filter')($scope.users.addresses, {'id':i})))
    $http.post(serverurl+"/addresses",$filter('filter')($scope.users.addresses, {'id':i})[0],{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         $scope.getUser();
         $scope.newAddress={};
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while adding users address');
       }
   );
   }*/
//-----------------------------For updateAddress End----------------------------------------------------------------
//-----------------------------For updateAddress start----------------------------------------------------------------
$scope.updateAddress = function() {
  //alert("updateAddress: "+$scope.selectedaddress);
    var tokenCookie = $cookies.get('Token');
    //console.log("tokenCookie found:"+tokenCookie);
    //console.log("update address = "+ JSON.stringify($scope.selectedaddress));
     $http.post(serverurl+"/addresses",$scope.selectedaddress,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         $scope.selectedaddress = response.data;
         //$scope.newAddress={};
         /*$scope.addressEditForm.$setPristine();
         $scope.addressEditForm.$setUntouched();*/
         $('#addresseditmodal').modal('hide');
         $scope.getUser();
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while adding users updateAddress');
       }
   );
   }
//-----------------------------For updateAddress End----------------------------------------------------------------

//-----------------------------For addNewAddress start----------------------------------------------------------------
$scope.addNewAddress = function() {
   //alert("addNewAddress"+JSON.stringify($scope.newaddress));
    var tokenCookie = $cookies.get('Token');
    //console.log('newaddress User', JSON.stringify($scope.newaddress));
            $scope.newaddress.latitude = '22.586408';
            $scope.newaddress.longitude = '88.400107';
            var latitude = '22.586408';
            var longitude = '88.400107';
    //console.log("tokenCookie found:"+tokenCookie)
    //console.log("$scope.newAddress:"+JSON.stringify($scope.newaddress));

    $http.post(serverurl+"/addresses",$scope.newaddress,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //console.log("response:"+JSON.stringify(response.data));
         $scope.getUser();
         $scope.newaddress={};
         $('#addressaddmodal').modal('hide');
       },
       function(errResponse){
          //console.error("errResponse:"+'Error while adding users newAddress');
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
         //console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.countries=response.data;
       },
       function(errResponse){
          // alert("errResponse"+response.data.message);
        //console.error("errResponse:"+'Error while fetching countries.');
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
};*/
$scope.getStates = function(param) {
  //alert("getStates"+param);
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
                    //console.log("Error Occoured In Fetching States");
                }
            );
 };
$scope.getStatesForSetAddress = function() {
  //alert("getStatesForSetAddress: ");
  CommonService.getStateList($scope.selectedaddress.countryId)
            .then(
                function successCallback(response) {
                  $scope.states=response;
                  ////console.log("$scope.states: "+$scope.states);
                },
                function error(response) {
                    //console.log("Error Occoured In Fetching States");
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
         //console.log("response:"+JSON.stringify(response.data))
         //self.products=response.data;
         $scope.cities=response.data;
       },
       function(errResponse){
           //alert("errResponse"+response.data);
        //console.error("errResponse:"+'Error while fetching cities.');
       }
    );
 }*/
$scope.getCities= function(param) {
 /*alert("getCities::"+param);*/
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
                    //console.log("Error Occoured In Fetching Cities");
                }
            );
 };
 $scope.getCitiesForSetAddress= function() {
  //alert("getCitiesForSetAddress: ");
  CommonService.getCityList($scope.selectedaddress.stateId)
            .then(
                function successCallback(response) {
                  $scope.cities=response;
                  ////console.log("$scope.cities: "+$scope.cities);
                },
                function error(response) {
                    //console.log("Error Occoured In Fetching Cities");
                }
            );
 };
//-----------------------------For getCities End----------------------------------------------------------------

//-----------------------------For makeDefault check start----------------------------------------------------------------
$scope.makeDefault= function(id) {
   //alert("checkedDefault: "+id+" length: "+$scope.users.addresses.length);
    var tokenCookie = $cookies.get('Token');
   //if($scope.users.addresses[id]==1)
   // for (var i = $scope.users.addresses.length - 1; i >= 0; i--) {
    for (var i =0; i <$scope.users.addresses.length ; i++) {
    //console.log("id = "+$scope.users.addresses[i].id + " val = "+$scope.users.addresses[i].isDefault)
     if($scope.users.addresses[i].id==id) {
       //alert("isDefault: "+$scope.users.addresses[i].id);

       $http.post(serverurl+"/addresses/makedefault",{id},{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
        $scope.getUser();
           //alert("response: "+response.data.message);
            //console.log("status:"+JSON.stringify(response.data.status));
            //$scope.msgEmail=response.data.message;
            // $route.reload();
       },
       function(errResponse){
           //alert("errResponse"+errResponse.data.message);
           //console.log("status:"+JSON.stringify(errResponse.data.status));
           //console.log("message:"+JSON.stringify(errResponse.data.message));
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

//-----------------------------For editAddress start----------------------------------------------------------------
$scope.editAddress= function(data,div_find) {
   //alert("editAddress: "+JSON.stringify(data));
   $scope.selectedaddress=data;
   //alert(data.id);
   localStorage.setItem("EditAddressData", JSON.stringify(data));
   localStorage.setItem("div_find_dup", div_find);
   // selectedaddress.id = 1;
   ////console.log("$scope.selectedaddress: "+JSON.stringify($scope.selectedaddress));
   $scope.getStatesForSetAddress();
   $scope.getCitiesForSetAddress();
   /*for (var i = $scope.users.addresses.length - 1; i >= 0; i--) {
     if($scope.users.addresses[i].id==aid) {
       //alert("editAddress: "+$scope.users.addresses[i].id);
      $scope.selectedaddress=$scope.users.addresses[i];
      //console.log("gdhgdh: "+JSON.stringify($scope.editAddressFetched));
     }
   }*/   $location.path( $rootScope.contextpath+"/manageaddresses");
         // $('#addresseditmodal').modal('show');
 }


$scope.addedAddress= function(div_find) {
   localStorage.setItem("div_find_dup", div_find);
   $location.path( $rootScope.contextpath+"/manageaddresses");
}


//-----------------------------For editAddress End----------------------------------------------------------------

//-----------------------------For deleteAddress start----------------------------------------------------------------
/*$scope.deleteAddress1= function(aId) {
   alert("deleteAddress: "+JSON.stringify(aId));
   //console.log("deleteAddress: "+JSON.stringify(aId));
   $scope.getStatesForSetAddress();
   $scope.getCitiesForSetAddress();
 }*/
$scope.deleteAddress = function(aId) {
            //alert("deleteFeatures:"+aId);
            reset();
            alertify.set({
                buttonReverse: true
            });
            alertify.confirm("Are you sure?", function(e) {
                if (e) {
                    var tokenCookie = $cookies.get('Token');
                    //console.log("tokenCookie found:" + tokenCookie)

                    $http.delete(serverurl + "/addresses/" + aId, {
                            headers: {
                                'Authorization': tokenCookie
                            }
                        })
                        .then(
                            function(response) {
                                //console.log("response:" + JSON.stringify(response.data));
                                //console.log("status:" + JSON.stringify(response.status));
                                alertify.success(response.data.message);
                                $scope.getUser();
                                $scope.getStatesForSetAddress();
                                $scope.getCitiesForSetAddress();
                            },
                            function(errResponse) {
                                //console.error("errResponse:" + 'Error while delete features');
                                //console.log("status:" + JSON.stringify(errResponse.status));
                                alertify.error("Your Address not deleted");
                                // alert("errResponse");
                                //console.error("errResponse orders:" + 'Error while fetching Address details');
                            }
                        );
                } else {
                    alertify.error("You've clicked Cancel");
                }
            });
            return false;
        }
//-----------------------------For deleteAddress end-----------------------------------------
$scope.getUser();
}]);
