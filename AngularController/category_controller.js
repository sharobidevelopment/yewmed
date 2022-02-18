'use strict';

angular.module('myApp').controller('categoryController', ['$cookies','$scope','$http','$route','$location','$timeout','ProductDetailService','$rootScope', '$routeParams' , function($cookies,$scope,$http,$route,$location,$timeout,ProductDetailService,$rootScope,$routeParams) {
//angular.module('myApp').controller('UserController', ['$scope', function($scope) {
	// alert('hi');
    var self = this;
    $(".ng-not-empty").val("");

   $scope.grp_name = "Aniket";
    $scope.limit = 20;
    $scope.navigators = {prev:{state:true}, next:{state:true}};
      $scope.curPage = 1,
      $scope.itemsPerPage = 3,
      $scope.maxSize = 5;

       $scope.catId = $routeParams.catid.split("-")[1];

       if($scope.catId == 2){
          $scope.grpId = 100;
       }
       else if($scope.catId == 4){
          $scope.grpId = 104;
       }
       //alert($scope.catId);

      //$scope.catId = window.localStorage.getItem("cateid");
	    // $scope.cateName = window.localStorage.getItem("catename");
     //  $scope.grpId = window.localStorage.getItem("groupId");

   if($scope.catId !=2 && $scope.catId !=4){
    $http.get(serverurl+"/items/getFiveItemsPerCategoryByCatId?catId="+$scope.catId)
         .then(
         function (response) {
           // console.log("viewGroupWiseProducts: "+JSON.stringify(response.data))
           self.itemCategoryWise=response.data; 
           $scope.cateName = response.data[0].category;
           //$scope.cateName = response.data[0].
           $scope.grpId = window.localStorage.getItem("groupId");
           var groups_product_div_height = 0;
           $timeout(function() {
        
        $('.groups_product_div_div').each(function() { 
             if ($(this).height() > groups_product_div_height) {
                groups_product_div_height = $(this).height();    
             }     
          });
        $('.groups_product_div_div').height(groups_product_div_height);
      }, 200);
           // $scope.order = '-name';

           if(self.itemCategoryWise.length != 0) {
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil(self.itemCategoryWise.length / $scope.limit);
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
                      $scope.copy_items = angular.copy(self.itemCategoryWise); 
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
         }
      );
}
else if($scope.catId ==2 || $scope.catId ==4) {
     $http.get(serverurl+"/items/details/group/"+$scope.grpId+"?page=1&limit=60")
         .then(
         function (response) {
           // console.log("viewGroupWiseProducts: "+JSON.stringify(response.data))
           self.itemCategoryWise=response.data; 
           $scope.cateName = response.data[0].category;
           var groups_product_div_height = 0;
           $timeout(function() {
        
        $('.groups_product_div_div').each(function() { 
             if ($(this).height() > groups_product_div_height) {
                groups_product_div_height = $(this).height();    
             }     
          });
        $('.groups_product_div_div').height(groups_product_div_height);
      }, 200);
           // $scope.order = '-name';

           if(self.itemCategoryWise.length != 0) {
                      $scope.paginate = function(){ 
                        $scope.pages = [];//clear it here resetting
                        var n = Math.ceil(self.itemCategoryWise.length / $scope.limit);
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
                      $scope.copy_items = angular.copy(self.itemCategoryWise); 
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
         }
      );
}


      self.viewItems = function(pid,grpip,grpname,cate_name,metatag) {
        	if(pid>0) {
        		// window.localStorage.setItem('selecteditemid',pid);
          //       window.localStorage.setItem("groupId",grpip);
          //       window.localStorage.setItem("grpname",grpname);
          //       window.localStorage.setItem("catename",cate_name);
            	// $location.path( $rootScope.contextpath+"/product");	
              $location.path($rootScope.contextpath+"/product/"+cate_name+"/"+grpname+"/"+metatag);
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



// add forgotpassword service after route