'use strict';

var App = angular.module('myApp');
App.controller('OrdersController', ['$scope','$rootScope','$cookies','$http','$route','$location','CartService', 'LoginService' , function($scope,$rootScope,$cookies,$http,$route,$location,CartService,LoginService) {
    var self = this;
    var page=1;
    userAuthorizationChecked();
    $scope.oneAtATime = true;
    $scope.coma = ',';
    self.orders=[];
    CallOrders();
     $scope.data = {};
     $scope.uid="";
     $scope.limit = 10;
     $scope.orderData = [];
     $scope.navigators = {prev:{state:true}, next:{state:true}};
     // $scope.invoice_order = {};

      $scope.curPage = 1,
      $scope.itemsPerPage = 3,
      $scope.maxSize = 5;


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




function userAuthorizationChecked(){
    //alert("userChecked");
      var tokenCookie = $cookies.get('Token');
    // console.log("tokenCookie userChecked found:"+tokenCookie)
     if(tokenCookie=='' || tokenCookie==undefined){
      $location.path( $rootScope.contextpath1);
    }
  }
 $scope.viewItems = function(pid) {
        //alert("viewItems"+pid);
          if(pid>0) {
            window.localStorage.setItem('selecteditemid',pid);
              $location.path( $rootScope.contextpath+"/product"); 
          }
        }
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

$scope.orderCancel= function(oId) {
   //alert("orderCancel"+oId);
      reset();
      alertify.set({ buttonReverse: true });
      alertify.confirm("Are you sure?", function (e) {
        if (e) {
             var obj = {};
             obj.id=oId;
            // alert("orderCancel: "+oId+"obj.id: "+obj.id);
              var tokenCookie = $cookies.get('Token');
              // console.log("tokenCookie found:"+tokenCookie)
               
         $http.post(serverurl+"/orders/cancel",obj,{                           
                    headers:{'Authorization': tokenCookie}
                    })
                 .then(
                 function (response) {
                   //alert("response");
                   // console.log("response orderCancel:"+JSON.stringify(response.data))
                       alertify.success(response.data.message);
                    for (var i = self.orders.length - 1; i >= 0; i--) {
                      self.orders[i];
                      if(self.orders[i].id == oId) {
                        self.orders[i].isCanceled = 1;
                        break;
                      }
                    }
                   getUserPoints();
                   $route.reload();
                   },
                   function(errResponse){
                    alertify.error("Your order not cancelled");
                    //alert("errResponse");
                    //console.error("errResponse orders:"+'Error while fetching orders details');
                       }
               );
        } else {
          alertify.error("You've clicked Cancel");
        }
      });
      return false;
    };
/*-------------------------CallOrders Start------------------------------------------------*/

function CallOrders() {
   //alert("ordersDetails");
    var tokenCookie = $cookies.get('Token');
    // console.log("tokenCookie found:"+tokenCookie)
    $http.get(serverurl+"/orders?page="+page+"&limit=10",{
        headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
            // console.log("response orders:"+JSON.stringify(response.data))
            localStorage.setItem("Ordersdetails", JSON.stringify(response.data));
            self.orders=self.orders.concat(response.data);
              // $scope.msgOrderCancel=response.data.message;
              // console.log("Length of orders : " + response.data.length);
              if(response.data.length==10){
                 page=page+1;
                 CallOrders();
              }
              else{

                  /**
                      * calculate the number of pages for us and 
                      * then set the first one as our active page
                      */ 
                    if(self.orders.length != 0) {
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil(self.orders.length / $scope.limit);
                        for(var i=0; i<n; i++)
                          $scope.pages.push({start:(i*$scope.limit), page:i+1, active:false});
                       
                        //set the first to active one
                        $scope.setPageActive(1); 
                      }
                      
                      /**
                       * this helps to set the wanted page number to be active
                       */ 
                      $scope.setPageActive = function(page){
                        var index = page-1;
                        $scope.index_no = page-1;
                        var n =   $scope.pages.length;
                        var previous_page = 1;
                        for(var i=0; i<n; i++){
                          if($scope.pages[i].active)
                            var current_page = $scope.pages[i].page;
                        
                          if(i==index)
                            $scope.pages[i].active = true;
                          else
                          $scope.pages[i].active= false;
                        } 
                      
                      //do calculation of next page offseting here
                     var limit = $scope.pages[index].start+$scope.limit;
                      
                      //keep it there so we dont mess with the original record
                      $scope.copy_items = angular.copy(self.orders); 
                      //slice dont add the limit so we add up, so we ignore the last one
                      $scope.copy_items = $scope.copy_items.splice($scope.pages[index].start, limit+1);
                     
                     
                     $scope.navigators["next"].state =  index < (n-1) ? true:false;
                     $scope.navigators["prev"].state =  index > 0 ? true:false;
                      }
                      
                      /**
                       * this is triggered when the user hit on the prev button
                       * this only works when the navigators.prev.state is true
                       */ 
                      $scope.prev = function(){ 
                        if($scope.navigators.prev.state){
                           $scope.setPageActive($scope.getCurrentPage()-1);
                        }
                      }
                      
                      /**
                       * this is triggered when the user hit on the next button
                       * this only works when the navigators.next.state is true
                       */ 
                      $scope.next = function(){
                        if($scope.navigators.next.state){
                           $scope.setPageActive($scope.getCurrentPage()+1);
                        }
                      }
                      
                      /**
                       * this returns the current active page
                       */ 
                      $scope.getCurrentPage = function (){
                        
                         for(var i=0;i<$scope.pages.length; i++)
                          if($scope.pages[i].active)
                            return i+1;
                      }
                      
                        $scope.paginate();

                     }
                     else {
                        console.log("No Data Found");
                     }   

              }
       },
       function(errResponse){
          //$scope.msgOrderCancel=response.data.message;
          //console.error("errResponse orders:"+'Error while fetching orders details');
          }
   );
 }

 $scope.$on('ngOrderFinished', function(ngRepeatFinishedEvent) {
      $('#datb_exm').DataTable( {
         rowReorder: {
            selector: 'td:nth-child(2)'
         },
         responsive: true,
         "bDestroy": true
         } );
});
 
/*-------------------------CallOrders End------------------------------------------------*/


/*-------------------------OrderCancel Start------------------------------------------------*/
 /*$scope.conformation= function(oId) {
  $('#confirmationmodal').modal('show');
   $scope.uid=oId;
}

$scope.orderCancel1= function() {
   var oId=$scope.uid;
   var obj = {};
   obj.id=oId;
   //alert("orderCancel: "+oId);
    var tokenCookie = $cookies.get('Token');
    console.log("tokenCookie found:"+tokenCookie)
   
     $http.post(serverurl+"/orders/cancel",obj,{
                 headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
         //alert("response");
         $('#confirmationmodal').modal('hide');
         console.log("response orderCancel:"+JSON.stringify(response.data))
          $scope.msgOrderCancel=response.data.message;
          for (var i = self.orders.length - 1; i >= 0; i--) {
            self.orders[i];
            if(self.orders[i].id == oId) {
              self.orders[i].isCanceled = 1;
              break;
            }
          }
       },
       function(errResponse){
         //alert("errResponse");
          $scope.msgOrderCancel=errResponse.data.message;
          //console.error("errResponse orders:"+'Error while fetching orders details');
           }
   );
  }*/
/*-------------------------OrderCancel End-----------------------------------------------*/



$scope.prescriptionsDownload= function(pid,filename) {
  //alert("prescriptionsId: "+pid+",filename: "+filename);
   var obj = {};
   obj.id=pid;
   var tokenCookie = $cookies.get('Token');
    
    
 $http.get(serverurl+"/prescriptions/download/"+obj.id,{                  
                  headers:{'Authorization': tokenCookie},
                  responseType: 'arraybuffer'
          })
       .then(
       function (response) {
         //alert("response");
         // console.log("response PrescriptionsDownload:"+JSON.stringify(response.data))
         // console.log("response header filename = "+response.headers['x-filename']);
         var linkElement = document.createElement('a');
         try {
            var blob = new Blob([response.data], {
                type: 'application/octet-stream' 
              });
            var url = window.URL.createObjectURL(blob);
 
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", filename);
 
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
        } catch (ex) {
            console.log(ex);
        }
       },
       function(errResponse){
         //alert("errResponse");
          //console.error("errResponse orders:"+'Error while fetching orders details');
           }
      );
  }
  $scope.invoiceCall = function(invoiceData) {
   //alert("invoiceCall: "+invoiceData.customerAddressId);
        if (invoiceData.id > 0) {
            // console.log("clicked: "+invoiceData.customerAddressId);
           // localStorage.setItem('invoice', invoiceData);
            localStorage.setItem("invoice", JSON.stringify(invoiceData));
            $location.path($rootScope.contextpath+"/invoice");

        } 
    }



  $scope.invoiceCall_new = function(order_id){
    var tokenCookie = $cookies.get('Token');
   // alert("order_id: "+order_id);
   // $scope.invoice_order.id = order_id;
   // $scope.invoice_order.price = order_price
   // console.log($scope.invoice_order);
   // var order_url = serverurl+'/orders/downloadInvoice/'+order_id;
   // window.open(order_url, '_blank');
   // window.location.href = order_url;
   // console.log(order_detail);
    $http.get(serverurl+"/orders/downloadInvoice/"+order_id,
        {
        headers:{'Authorization': tokenCookie}
          })
       .then(
       function (response) {
        alert("Response");
            var order_url = serverurl+'/orders/downloadInvoice/'+order_id;
            window.open(order_url, '_blank');
       },
       function(errResponse){
          alert("Error Response");
          //console.error("errResponse orders:"+'Error while fetching orders details');
          }
   );
  }  





$scope.checkItemStatus= function(order) {
   var count=0;
   for(var i=0;i<order.orderDetails.length;i++){
       if(order.orderDetails[i].status != 0){
          count++;
        }
    }
    if(order.orderDetails.length == count){
       return false;
    }
    else{
      return true;
    }
  
}



function  getUserPoints(){
        CartService.callCustomerAddressData()
            .then(
                function successCallback(response) {
                    $rootScope.points=response.points;
                    localStorage.setItem("currentpoints", $rootScope.points);
                     checkCurrentActivePackage();
                    },
                function error(response) {}
            );
        }
function  checkCurrentActivePackage(){
 if(localStorage.getItem("membershipdetails") != null ){
         var plans = JSON.parse(localStorage.getItem("membershipdetails"));
         for(var i=1;i<=plans.length-1;i++){
          if($rootScope.points>=plans[i-1].pointMin && $rootScope.points<=plans[i].pointMin){
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




// $scope.moreOrders = function() {
//       alert("moreOrders");
//       page=page+1;
//       CallOrders();
//     }


  $scope.numOfPages = function () {
    return Math.ceil(self.orders.length / $scope.itemsPerPage);
    alert(self.orders.length);
    
  };
  
    $scope.$watch('curPage + numPerPage', function() {
    var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
    end = begin + $scope.itemsPerPage;
    
    $scope.filteredItems = self.orders.slice(begin, end);
     });



// $scope.openDetails = function(invoiceData,id) {
//      if (invoiceData.id > 0) {
//              $scope.orderData = [];
//              $scope.orderData = invoiceData;
//               if(id == 1)
//                  $("#collapseOneOrder").modal('show')
//               else 
//                 $("#collapsePrescription").modal('show')
                
//         }
//     }

    var openDetails_id =0;
    var openDetails_count = 0;
    var prescription_id = 0;
    var prescription_count = 0;
    $scope.openDetails = function(invoiceData,id) {
        $(".show_details_table_div").hide();
        if(id==1){
          prescription_id = 0;
          prescription_count = 0;
          if(invoiceData.id == openDetails_id){
              openDetails_count = openDetails_count+1;
          }
          else{
             openDetails_count =1;
             openDetails_id = invoiceData.id;
          }
          if(openDetails_count % 2 ==0){
             $("#show_details_table_div_"+invoiceData.id).hide();
          }
          else{
             $("#show_details_table_div_"+invoiceData.id).show();
          }
        }

        else{
          openDetails_id =0;
          openDetails_count = 0;
          if(invoiceData.id == prescription_id){
              prescription_count = prescription_count+1;
          }
          else{
             prescription_count =1;
             prescription_id = invoiceData.id;
          }
          if(prescription_count % 2 ==0){
             $("#show_prescription_div_"+invoiceData.id).hide();
          }
          else{
             $("#show_prescription_div_"+invoiceData.id).show();
          }
        }
        
    }



    $scope.openDetails_for_mob = function(invoiceData,id) {
        $(".show_details_table_div").hide();
        if(id==1){
             $("#show_details_table_div_dup_"+invoiceData.id).show();
        }

        else{
             $("#show_prescription_div_dup_"+invoiceData.id).show();
        }
        
    }




    var showOrderstatus_count = 0;
    var showOrderstatus_id = 0;

    $scope.showOrderStatus = function(order,id){
        console.log("status" + order.status);
        $(".show_progtrckr").hide();
        $(".show_details_tr").removeClass("show_details_tr_active");
        if(order.id ==showOrderstatus_id){
          showOrderstatus_count = showOrderstatus_count+1;
        }
        else{
          showOrderstatus_count = 1;
          showOrderstatus_id = order.id;
        }
        //alert(showOrderstatus_count);
        if(showOrderstatus_count %2!=0){
        $("#show_status_"+order.status+"_"+id).show();
        $("#show_details_tr_"+order.id).addClass("show_details_tr_active")
      }
      else{

      }
    }


    $scope.showOrderStatus_dup = function(order,id){
        console.log("status" + order.status);
        $(".show_progtrckr").hide();
        $(".show_details_tr").removeClass("show_details_tr_active");
        $("#show_status_dup_"+order.status+"_"+id).show();
        $("#show_status_dup1_"+order.status+"_"+id).show();
        $("#show_details_tr_dup_"+order.id).addClass("show_details_tr_active")
        if(order.status ==0){
            $("#order_status_put_"+id).html("<b> Status : </b> <span> Order Placed </span>");
        }
        if(order.status ==1){  
            $("#order_status_put_"+id).html("<b> Status : </b> <span> Order Placed -> Accepted </span>");
        }
        if(order.status ==2){
            $("#order_status_put_"+id).html("<b> Status : </b> <span> Order Placed -> Accepted -> Packged </span>");
        }
        if(order.status ==3){
            $("#order_status_put_"+id).html("<b> Status : </b> <span> Order Placed -> Accepted -> Packged -> Out for Delivery </span>");
        }
        if(order.status ==4){
            $("#order_status_put_"+id).html("<b> Status : </b> <span> Order Placed -> Accepted -> Packged -> Out for Delivery -> Delivered </span>");
        }
    }









}]);