/**
 * 
 */
'use strict';
var applog = angular.module('myApp',['ngRoute','ngCookies','ngIdle','infinite-scroll', 'ngAnimate', 'ngMessages', 'ngAria', 'ngMaterial', 'ngPatternRestrict']);
applog.config([ '$routeProvider', '$locationProvider','IdleProvider', 'KeepaliveProvider',
    function($routeProvider, $locationProvider,IdleProvider, KeepaliveProvider) {
  
  var contextpath='/yewmed';
   //var contextpath='';
  // $routeProvider.when('/yewmed/',
      //$routeProvider.when('/' , {
        $routeProvider.when('/yewmed/', {
            templateUrl : '/yewmed/views/home.html',
          /* controller : 'HomeController'*/
        })
        $routeProvider.when(contextpath+'/register', {
            templateUrl : '/yewmed/views/register.html',
           /* controller : 'LoginController'*/
        }).when(contextpath+"/login", {
            templateUrl : "/yewmed/views/login.html"
        }).when(contextpath+"/product/:catname/:grpname/:metatag", {
            templateUrl : "/yewmed/views/productdetails.html"
        }).when(contextpath+"/products", {
            templateUrl : "/yewmed/views/products.html"
        }).when(contextpath+'/profileUpdate', {
            templateUrl : '/yewmed/views/profileUpdate.html',
        }).when(contextpath+'/manageaddresses', {
            templateUrl : '/yewmed/views/manage_addresses.html',
        }).when(contextpath+'/manageaddress', {
            templateUrl : '/yewmed/views/manage_address.html',
        }).when(contextpath+'/myaccount', {
            templateUrl : '/yewmed/views/my_account.html',
        }).when(contextpath+"/mycart", {
            templateUrl : "/yewmed/views/cart.html"
        }).when(contextpath+"/forgetpwd", {         
            templateUrl : "/yewmed/views/forgotpassword.html"
        }).when(contextpath+"/checkout", {         
            templateUrl : "/yewmed/views/checkout.html"
        }).when(contextpath+"/ordersDetails", {         
            templateUrl : "/yewmed/views/order_details_dup.html"
        }).when(contextpath+"/invoice", {         
            templateUrl : "/yewmed/views/invoice.html"
        }).when(contextpath+"/memberplan", {         
            templateUrl : "/yewmed/views/membershipPlan.html"
        }).when(contextpath+"/mycart"+"/:primaryNav", {         
            templateUrl : "/yewmed/views/cart.html"
        }).when(contextpath+"/mywishlist", {         
            templateUrl : "/yewmed/views/wishList.html"
        }).when(contextpath+"/terms-conditions", {         
            templateUrl : "/yewmed/views/terms-condition.html"
        }).when(contextpath+"/aboutus", {         
            templateUrl : "/yewmed/views/about-us.html"
        }).when(contextpath+"/best-sales", {         
            templateUrl : "/yewmed/views/best-sales.html"
        }).when(contextpath+"/new-product", {         
            templateUrl : "/yewmed/views/new-product.html"
        }).when(contextpath+"/legal-notice", {         
            templateUrl : "/yewmed/views/legal-notice.html"
        }).when(contextpath+"/delivery", {         
            templateUrl : "/yewmed/views/delivery.html"
        }).when(contextpath+"/sitemap", {         
            templateUrl : "/yewmed/views/sitemap.html"
        }).when(contextpath+"/contactus", {         
            templateUrl : "/yewmed/views/contactus.html"
        }).when(contextpath+"/userprivacy", {         
            templateUrl : "/yewmed/views/useprivacy.html"
        }).when(contextpath+"/policy", {         
            templateUrl : "/yewmed/views/policy.html"
        }).when(contextpath+"/Forgotpassword", {         
            templateUrl : "/yewmed/views/forgot_password.html"
        }).when(contextpath+"/pricesdrop", {         
            templateUrl : "/yewmed/views/pricesdrop.html"
        }).when(contextpath+"/groups"+"/:id/:grpId", {         
           templateUrl : "/yewmed/views/groupwiseItem.html"
            //controller:"LoginController"
        }).when(contextpath+"/404", {         
            templateUrl : "/yewmed/views/404.html"
        }).when(contextpath+"/prescriptionorder", {         
            templateUrl : "/yewmed/views/prescription_order.html"
        }).when(contextpath+"/booklabtest", {         
            templateUrl : "/yewmed/views/book_lab_test.html"
        }).when(contextpath+"/reordermedicine", {         
            templateUrl : "/yewmed/views/reorder_medicine.html"
        }).when(contextpath+"/householdorder", {         
            templateUrl : "/yewmed/views/household_order.html"
        }).when(contextpath+"/category/:catid", {         
            templateUrl : "/yewmed/views/category.html"
        }).when(contextpath+"/serachbaseitem", {         
            templateUrl : "/yewmed/views/search_base_item.html"
        }).when(contextpath+"/successfulpayment", {         
            templateUrl : "/yewmed/views/payment_successfull.html"
        }).when(contextpath+"/retun_cancellation_policy", {         
            templateUrl : "/yewmed/views/retun_cancellation_policy.html"
        }).otherwise({
            redirectTo : contextpath+'/404'
            //redirectTo : 'commingSoon.html' book_lab_test.html
        });
       $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
          });/*For avoid #! from url*/
       
       IdleProvider.idle(10);
       //IdleProvider.timeout(5);
       //KeepaliveProvider.interval(10);
       
       /* $stateProvider.state('product', {
      url: contextpath+'/product',
      templateUrl : "views/productdetails.html"
     // controller: 'UsersCtrl',
      params: {
          obj: null
      }
  });*/

     }

    
  
]).run(function(Idle,$rootScope,$anchorScroll, $routeParams, $location){
  // start watching when the app runs. also starts the Keepalive service by default.
  Idle.watch();
   
      $rootScope.lat=0;
      $rootScope.lng=0;
      $rootScope.activeclass='';
      $rootScope.primaryNav='';
      
      // $rootScope.contextpath = '/yewmed';
      $rootScope.contextpath = '';
       if(localStorage.getItem("cartLocalStorage") != null ){
         $rootScope.totalitemsincart=JSON.parse(localStorage.getItem("cartLocalStorage")).length;
         }
       else{
           $rootScope.totalitemsincart=0; 
         }

      if(localStorage.getItem("wishListLocalStorage") != null ){
         $rootScope.totalitemsinwishlist=JSON.parse(localStorage.getItem("wishListLocalStorage")).length;
         }
       else{
           $rootScope.totalitemsinwishlist=0; 
         }


     if(localStorage.getItem("loggedinuserdetails") != null ){
          var userdata=JSON.parse(localStorage.getItem("loggedinuserdetails"));
             if(userdata.id == undefined){
                  
                $rootScope.activeusername='User'; 
                $rootScope.points=0;
                $rootScope.activeclass='';
               
              }else{
                /*$rootScope.activeusername=userdata.fname+" "+userdata.lname;*/
                $rootScope.activeusername=userdata.fname;
                var currentpoints=localStorage.getItem("currentpoints");
                 if(currentpoints!=null){
                    $rootScope.points=currentpoints;
                  }
                var currentactiveclass=localStorage.getItem("currentactiveclass");
                 if(currentactiveclass!=null){
                    $rootScope.activeclass=currentactiveclass;
                  }
                }
         }
      else{
          
           $rootScope.activeusername='User'; 
           $rootScope.points=0;
           $rootScope.activeclass='';
          
         }
         $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
           $location.hash($routeParams.scrollTo);
           $anchorScroll();
            $(".aniketnav").css("display", "none");  
         });




});
applog.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
applog.directive("preventTypingGreater", function() {
  return {
    link: function(scope, element, attributes) {
      var oldVal = null;
      element.on("keydown keyup", function(e) {
    if (Number(element.val()) > Number(attributes.max) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          element.val(oldVal);
        } else {
          oldVal = Number(element.val());
        }
      });
    }
  };
});
applog.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function() {
                     scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);

applog.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});
applog.directive('validPasswordC', function() {
  return {
    require: 'ngModel',
    scope: {

      reference: '=validPasswordC'

    },
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue, $scope) {

        var noMatch = viewValue != scope.reference
        ctrl.$setValidity('noMatch', !noMatch);
        return (noMatch)?noMatch:!noMatch;
      });

      scope.$watch("reference", function(value) {;
        ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

      });
    }
  }
});



applog.directive('ngEnter', function() {
    return function(scope, elem, attrs) {
      elem.bind("keydown keypress", function(event) {
        // 13 represents enter button
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });

// applog.directive("compareTo", function() {
//       return {
//         require: "ngModel",
//         scope: {
//           reTypePassword: "=compareTo"
//         },
//         link: function(scope, element, attributes, modelVal) {

//           modelVal.$validators.compareTo = function(val) {
//             return val == scope.reTypePassword;
//           };

//           scope.$watch("reTypePassword", function() {
//             modelVal.$validate();
//           });
//         }
//       };
//     });
// applog.directive('datepicker', function() {
//          return {
//             restrict: 'A',
//             require: 'ngModel',
//             compile: function() {
//                return {
//                   pre: function(scope, element, attrs, ngModelCtrl) {
//                      var format, dateObj;
//                      format = (!attrs.dpFormat) ? 'dd/mm/yyyy' : attrs.dpFormat;
//                      if (!attrs.initDate && !attrs.dpFormat) {
//                         dateObj = new Date();
//                         scope[attrs.ngModel] = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
//                      } else if (!attrs.initDate) {
//                         scope[attrs.ngModel] = attrs.initDate;
//                      } else {
//                      }
//                      $(element).datepicker({
//                         format: format,

//                      }).on('changeDate', function(ev) {
//                         // To me this looks cleaner than adding $apply(); after everything.
//                         scope.$apply(function () {
//                            ngModelCtrl.$setViewValue(ev.format(format));
//                         });
//                      });
//                   }
//                }
//             }
//          }
//       });


/*applog.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
});*/

/*applog.directive("owlCarousel", function() {
  return {
    restrict: 'E',
    transclude: false,
    link: function (scope,element) {
      // scope.initCarousel = function(element) {
        // provide any default options you want
        var defaultOptions = {
        };
        var customOptions = scope.$eval($(element).attr('data-options'));
        // combine the two options objects
        for(var key in customOptions) {
          defaultOptions[key] = customOptions[key];
        }
        // init carousel
        $(element).owlCarousel(defaultOptions);
      // };
    }
  };
});
applog.directive('owlCarouselItem', [function() {
  return {
    restrict: 'A',
    transclude: false,
    link: function(scope, element) {
      // wait for the last item in the ng-repeat then call init
      if(scope.$last) {
        scope.initCarousel(element.parent());
      }
    }
  };
}]);*/