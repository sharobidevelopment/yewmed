'use strict';
angular.module('myApp').controller('HomeController', ['$cookies', '$route' ,'$http','$scope','$rootScope','$location','ProductDetailService','LoginService', '$interval', function($cookies,$route,$http,$scope,$rootScope,$location,ProductDetailService,LoginService,$interval) {
    var self = this;
    $scope.coma = ",";
    $(document).ready(function() {

    // alert("Hi");
    $(".ng-not-empty").val(""); 
    var promise;


    $rootScope.statusCookie = $cookies.get('Status');


    //alert("title"+document.title);

// ............................new code...............................

    angular.element(document).ready(function () {
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

});

    // ..............................new code end........................



     


     // .............................new code 07/01/2020.......................

         $scope.gotoCategory = function(catid, catname ){
            // window.localStorage.setItem("cateid",catid);
            // window.localStorage.setItem("catename",catname);
            // $location.path( $rootScope.contextpath+"/category");
            $location.path( $rootScope.contextpath+"/category/"+catname+"-"+catid);
         }

     // .............................new code end 07/01/2020.......................


      
  /*----------------------------
    5. Slider Activation
    -----------------------------*/
    $(".slider-activation").owlCarousel({
        // loop: true,
        // margin: 0,
        // nav: true,
        // autoplay: true,
        // animateOut: 'fadeOut',
        // animateIn: 'fadeIn',
        // autoplayTimeout: 10000,
        // items: 1,
        // navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        // dots: true,
        // autoHeight:true,
        // lazyLoad: true,
        // responsive: {
        //     0: {
        //         items: 1
        //     },
        //     1920: {
        //         items: 1
        //     }
        // }
        autoplay: true,
            loop: true,
            nav: true,
            dots: true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            autoplayTimeout: 10000,
            items: 1,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 5000,
            margin: 0,
            dots: true,
            autoHeight:true,
            lazyLoad: true,
            responsive: {
                0: {
                    items: 1,
                    autoplay: true,
                    smartSpeed: 100
                },
                1920: {
                    items: 1
                }
            }
    });

    /*----------------------------------------------------
    18. Home2 Categorie  Activation
    -----------------------------------------------------*/
    $('.categorie-acitve').owlCarousel({
        autoplay: true,
        loop: false,
        nav: false,
        dots: true,
        smartSpeed: 500,
        margin: 0,
        responsive: {
            0: {
                items: 1,
                autoplay: true,
                smartSpeed: 100
            },
            480: {
                items: 3
            },
            768: {
                items: 4
            },
            992: {
                items: 5
            },
            1200: {
                items: 6
            }
        }
    });

 // $scope.$on('ngRepeatFinished1', function(ngRepeatFinishedEvent) {
    $('.featured-pro-active')
        .on('changed.owl.carousel initialized.owl.carousel', function (event) {
            $(event.target)
                .find('.owl-item1').removeClass('last')
                .eq(event.item.index + event.page.size - 1).addClass('last');
               
        }).owlCarousel({
            autoplay: true,
            loop: true,
            nav: false,
            dots: false,
            smartSpeed: 300,
            margin: 0,
            //navText:["<div class='nav-btn prev-slide'></div>","<div class='nav-btn next-slide'></div>"],
            //navClass:['owl-prev', 'owl-next'],

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
        var owl1 = $('.featured-pro-active');

        $("#home_1stsli_next").click(function() {
          owl1.trigger('next.owl.carousel');
        });
        $("#home_1stsli_prev").click(function() {
          owl1.trigger('prev.owl.carousel');
        });

 // });
 $scope.$on('ngRepeatFinished2', function(ngRepeatFinishedEvent) {
    $('.demo_feature ')
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

        var owl2 = $('.demo_feature ');

        $("#home_2ndsli_next").click(function() {
          owl2.trigger('next.owl.carousel');
        });
        $("#home_2ndsli_prev").click(function() {
          owl2.trigger('prev.owl.carousel');
        });

 });


 // $scope.$on('ngTestRepeat', function(ngRepeatFinishedEvent) {

        //         $('.featured-pro-active1 ')
        // .on('changed.owl.carousel initialized.owl.carousel', function (event) {
        //     $(event.target)
        //         .find('.owl-item').removeClass('last')
        //         .eq(event.item.index + event.page.size - 1).addClass('last');
               
        // })
        $('.featured-pro-active1 ').owlCarousel({
            nav: true,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            autoplay: true,
            loop: true,
            dots: false,
            items: 1,
            smartSpeed: 300,
            margin: 0,
            responsiveClass:true,
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
                    items: 2
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 3
                }
            }
        });
        var owl3 = $('.featured-pro-active1');

        $("#home_testisli_next").click(function() {
          owl3.trigger('next.owl.carousel');
        });
        $("#home_testisli_prev").click(function() {
          owl3.trigger('prev.owl.carousel');
        });

  // });
 
 $(".owl-brand-slider").owlCarousel({
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        // items: 5,
        margin: 0,
        // stagePadding: 30,
        smartSpeed: 450,
        navText: ["<i class=\"fa fa-angle-left\"></i>", "<i class=\"fa fa-angle-right\"></i>"],
        loop: true,
        nav: true,
        dots: true,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
                autoplay: true,
                smartSpeed: 300
            },
            340: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            },
            1200: {
                items: 5
            }
        }
      });
    });

    
     self.viewItems = function(pid,grpip,grpname,cate_name,cateid,metatag) {
        // alert(grpip);
        // alert(grpname);
        // alert(cate_name);
        	if(pid>0) {
        		// window.localStorage.setItem('selecteditemid',pid);
          //       window.localStorage.setItem("groupId",grpip);
          //       window.localStorage.setItem("grpname",grpname);
          //       window.localStorage.setItem("catename",cate_name);
          //       window.localStorage.setItem("cateid",cateid);
          //   	$location.path( $rootScope.contextpath+"/product");	
                $location.path($rootScope.contextpath+"/product/"+cate_name+"/"+grpname+"/"+metatag);
        	}
        	
        }
         self.itemTabSlide = [];

        
       
        	$http.get(serverurl+"/items/details/group/6?page="+1+"&limit=16")
	 		   .then(
	 		   function (response) {
	 			   // console.log("tabdata:"+JSON.stringify(response.data))
	 			   self.itemTabSlide=response.data;
	 		   },
	 		   function(errResponse){
	 		   }
	 		);
       
        
    //     self.topSellingProducts = [];
    //     $http.get(serverurl+"/items/getAllTopSaleItems")
	 		//    .then(
	 		//    function (response) {
	 		// 	   self.topSellingProducts=response.data;
	 		//    },
	 		//    function(errResponse){
    //              self.topSellingProducts=[
    //              {"id":380323,"name":"MASK N95 3 LAYER","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":0,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"NO SCHEDULE","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":170.0},
    //              {"id":380324,"name":"MASK N95 5 LAYER","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":0,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"NO SCHEDULE","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":200.0},
    //              {"id":380325,"name":"Mask Safeside KN95","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":70.0},
    //              {"id":380326,"name":"Mask Venus N95","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":230.0},
    //              {"id":380327,"name":"Mask 3Ply Use & Throw","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":3.0},
    //              {"id":380328,"name":"SANITIZER ELOVRA BY KP'S 100 ML","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":50.0}
    //              ]
	 		//    }
	 		// );


            self.topSellingProducts=[
                 {"id":380323,"name":"MASK N95 3 LAYER","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":0,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"NO SCHEDULE","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":170.0, "metaTag": "380323-MASK-N95-3-LAYER-1"},
                 {"id":380324,"name":"MASK N95 5 LAYER","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":0,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"NO SCHEDULE","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":200.0, "metaTag": "380324-MASK-N95-5-LAYER-1"},
                 {"id":380325,"name":"Mask Safeside KN95","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":70.0, "metaTag": "380325-Mask-Safeside-KN95-1"},
                 {"id":380326,"name":"Mask Venus N95","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":230.0, "metaTag": "380326-Mask-Venus-N95-1"},
                 {"id":380327,"name":"Mask 3Ply Use & Throw pack of 50","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":3.0, "metaTag": "380327-Mask-3Ply-Use-&-Throw-pack-of-50-1"},
                 {"id":380328,"name":"SANITIZER ELOVRA BY KP'S 100 ML","code":null,"hsnCode":null,"sku":null,"groupId":133,"categoryId":3,"subCategoryId":0,"scheduleId":6,"contentId":0,"brandId":0,"manufacturerId":0,"group":"Fight Corona","category":"Home Care","subCategory":"No Subcategory","schedule":"COMMON","content":"No Content","brand":"No Brand","manufacturer":"No Manufacturer","saleTaxId":null,"saleTaxPercentage":null,"isDiscount":null,"discount":null,"maxDiscountLimit":null,"taxTypeId":null,"strength":null,"totalCurrentPackQty":null,"conversion":1,"price":50.0, "metaTag":"380328-SANITIZER-ELOVRA-BY-KP'S-100-ML-1"}
            ];

         self.categories = [];
        // $http.get(serverurl+"/categories/tree")
        //       .then(
        //       function (response) {
        //         self.categories1 = response.data;
        //         console.log("self.categories1 " + JSON.stringify(self.categories1[0].groups));
        //             },  
        //               function error(errResponse) {
        //               self.categories1="categoriesMenu not found";
        //               }
        //   );


        self.categories1 = [{"id":21,"categoryId":1,"name":"Infusion","description":null},{"id":32,"categoryId":1,"name":"Pessary","description":null},{"id":28,"categoryId":1,"name":"Oil","description":null},{"id":31,"categoryId":1,"name":"Pen","description":null},{"id":20,"categoryId":1,"name":"Gum Paint","description":null},{"id":25,"categoryId":1,"name":"Lotion","description":null},{"id":107,"categoryId":1,"name":"Ors","description":null},{"id":1,"categoryId":1,"name":"Syrup","description":null},{"id":22,"categoryId":1,"name":"Inhaler","description":null},{"id":111,"categoryId":1,"name":"Vaccine","description":null},{"id":14,"categoryId":1,"name":"Enema","description":null},{"id":9,"categoryId":1,"name":"Aplicap","description":null},{"id":109,"categoryId":1,"name":"Surgical","description":null},{"id":29,"categoryId":1,"name":"Ointment","description":null},{"id":30,"categoryId":1,"name":"Patch","description":null},{"id":7,"categoryId":1,"name":"Capsule","description":null},{"id":8,"categoryId":1,"name":"Injection","description":null},{"id":27,"categoryId":1,"name":"Mouth Wash/Gargle","description":null},{"id":13,"categoryId":1,"name":"Emulsion","description":null},{"id":18,"categoryId":1,"name":"Granules","description":null},{"id":34,"categoryId":1,"name":"Respules","description":null},{"id":35,"categoryId":1,"name":"Rotacap","description":null},{"id":24,"categoryId":1,"name":"Linctus","description":null},{"id":16,"categoryId":1,"name":"Gel","description":null},{"id":10,"categoryId":1,"name":"Cream","description":null},{"id":36,"categoryId":1,"name":"Sachet","description":null},{"id":40,"categoryId":1,"name":"Spray","description":null},{"id":112,"categoryId":1,"name":"Vet","description":null},{"id":19,"categoryId":1,"name":"Gum Astringent","description":null},{"id":26,"categoryId":1,"name":"Mouth Paint","description":null},{"id":6,"categoryId":1,"name":"Tablet","description":null},{"id":11,"categoryId":1,"name":"Drop","description":null},{"id":17,"categoryId":1,"name":"Glue","description":null},{"id":15,"categoryId":1,"name":"Expectorant","description":null},{"id":33,"categoryId":1,"name":"Powder","description":null},{"id":12,"categoryId":1,"name":"Elixir","description":null},{"id":23,"categoryId":1,"name":"Kit","description":null},{"id":42,"categoryId":1,"name":"Suspension","description":null},{"id":108,"categoryId":1,"name":"Paint","description":null},{"id":39,"categoryId":1,"name":"Solution","description":null},{"id":41,"categoryId":1,"name":"Suppository","description":null}];

              
        // $scope.$on('IdleStart', function() {
        //     if ($rootScope.statusCookie == 'Active') {
        //       var promise = $interval(callAtInterval, 10000);
        //     }
        // });

        // $scope.$on('IdleEnd', function() {
        //     $interval.cancel(promise); 
        // });
        // function callAtInterval() {
        //     console.log("Interval occurred");
        // }
       
     
           self.viewGroupWiseProducts = function(id , grpname, catename,cateid) {
        // alert("id: "+id);
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
      $location.path( $rootScope.contextpath+"/groups"+"/"+catename+"/"+grpname+"-"+id) 
    }
  }



    self.checkWishlist = function(id) {
        var present = false;
        var wish_items = JSON.parse(localStorage.getItem("wishListLocalStorage"));
        //console.log("wishListLocalStorage:::"+localStorage.getItem("wishListLocalStorage"));
        var qty = 1;

        if (wish_items != null) {
            for (var i = 0; i < wish_items.length; i++) {
                if (wish_items[i].itemId == id) {
                     present = true;
                     break;
                }
            }
        }

        return present;
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
                            // console.log("add data" + JSON.parse(localStorage.getItem("cartLocalStorage")));
                            $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;                           
                        },
                        function error(response) {
                          console.log("Error Occoured");
                        }
                    );
            } else {
                // activity for local storage         
                if (localStorage.getItem("cartLocalStorage") === null) {
                    /*$scope.cart.id=0;*/
                    $scope.cartitems.push($scope.cart);
                    // console.log("cart item data : " + JSON.stringify($scope.cartitems));
                    localStorage.setItem("cartLocalStorage", JSON.stringify($scope.cartitems));
                     $route.reload();
                } else {
                    $scope.items = JSON.parse(localStorage.getItem("cartLocalStorage"));
                    //console.log("cart item data : " + JSON.stringify(JSON.parse(localStorage.getItem("cartLocalStorage"))));
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

                // console.log(localStorage.getItem("cartLocalStorage"));
                $rootScope.totalitemsincart = JSON.parse(localStorage.getItem("cartLocalStorage")).length;
            }
            
            // $.alert.open('Item Added Successfully');  
            $("#alertMsgText").html('');
            $("#alertMsgText").html('Item added in cart successfully');
            $("#alert-modal").modal('show');


        //$route.reload();
        
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



 // LoginService.groupsMenuRequest()
 //              .then(
 //              function successCallback(response) {
 //                console.log("groupsMenu Details:"+JSON.stringify(response.data));
 //                self.allGroups = response.data;
 //                self.item1stproGroupWise = [];
 //                for(var i=0;i<self.allGroups.length;i++){
 //                    //console.log(self.allGroups[i].id);
 //                    $http.get(serverurl+"/items/details/group/"+self.allGroups[i].id+"?page="+1+"&limit=16")
 //                     .then(
 //                     function (response) {
 //                       //console.log("viewGroupWiseProducts: "+JSON.stringify(response.data))
 //                       //self.item1stproGroupWise=response.data;
 //                       //console.log(response.data[0]);
 //                       self.item1stproGroupWise.push(response.data[0]);
 //                        //console.log("group wise 1st item :" +self.item1stproGroupWise);
 //                        // self.item1stproGroup = self.item1stproGroupWise;
 //                        if(self.item1stproGroupWise.length == 25){
 //                           self.item1stpro = self.item1stproGroupWise;
 //                           console.log("owl products" + JSON.stringify(self.item1stproGroup));
                           
 //                        } 
 //                        else {
 //                        } 
 //                         console.log("owl products" + self.item1stproGroup);
 //                     },
 //                     function(errResponse){
 //                     }
                     
 //                  );
 //                }
 //                    },  
 //                      function error(response) {
 //                      self.allGroups="groupsMenu not found";
 //                      }

 //          );

            

  // console.log(self.itemCapSlide);
      
}]);
