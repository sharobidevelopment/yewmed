angular.module('myApp').controller('searchBaseItemController', ['$scope','$http','$route','$cookies','ProductDetailService','$location','$timeout', 'LoginService' , '$rootScope' , function($scope,$http,$route,$cookies,ProductDetailService,$location,$timeout,LoginService,$rootScope) {
 $(".ng-not-empty").val("");

   var self = this;
   $scope.limit = 20;
   $scope.navigators = {prev:{state:true}, next:{state:true}};
     // $scope.invoice_order = {};

      $scope.curPage = 1,
      $scope.itemsPerPage = 3,
      $scope.maxSize = 5;

  $scope.serachItemdata = localStorage.getItem("serachItemPressEnterdata"); 

  $http.get(serverurl+"/items/searchbasic?name="+$scope.serachItemdata)
       .then(
       function (response) {
          $scope.serachbaseitem = response.data;
          if($scope.serachbaseitem != 0) {
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil($scope.serachbaseitem.length / $scope.limit);
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
                      $scope.copy_items = angular.copy($scope.serachbaseitem); 
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
       },
       function(errResponse){
        console.error("errResponse:"+'Error while fetching.');
       }
    );


    self.viewItems = function(pid,grpip,grpname,cate_name,cateid) {
      var url = $location.url();
        if (pid > 0) {
            // console.log("clicked"+url);
            window.localStorage.setItem('selecteditemid', pid);
            window.localStorage.setItem("groupId",grpip);
            window.localStorage.setItem("grpname",grpname);
            window.localStorage.setItem("catename",cate_name);
            window.localStorage.setItem("cateid",cateid);
            $location.path($rootScope.contextpath+"/product");
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




}]);




