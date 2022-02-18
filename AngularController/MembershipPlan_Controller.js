'use strict';

angular.module('myApp').controller('MemberPlanController', ['$scope','$http','$cookies','$route','$location','MemberPlanService','$rootScope', function($scope,$http,$cookies,$route,$location,MemberPlanService,$rootScope) {
  var self = this;
  $scope.plans = [];
  $scope.features = [];
  $scope.statusCookie = $cookies.get('Status');
   if ($scope.statusCookie === undefined) {
        $scope.statusCookie = 'Deactive';
    }
    getAllPlans();
    getFeatures();
   
    /*if ($scope.statusCookie == 'Active') {
           $scope.plans = JSON.parse(localStorage.getItem("membershipdetails"));
           $scope.features =JSON.parse(localStorage.getItem("membershipfeatures"));
         }
    else{*/
      
     // }  
      /*if(localStorage.getItem("membershipdetails") == null || localStorage.getItem("membershipdetails") == undefined ){
         getAllPlans();
        }
      else{
          $scope.plans=JSON.parse(localStorage.getItem("membershipdetails"));
        }
      if(localStorage.getItem("membershipfeatures") == null ){
           getFeatures();
       }
       else{
        $scope.features=JSON.parse(localStorage.getItem("membershipfeatures"));
       }*/



       // alert("Hi");
       $(".ng-not-empty").val("");

       
  function getAllPlans(){
       MemberPlanService.getAllMembershipPlans()
            .then(
                function successCallback(response) {
                  console.log(JSON.stringify(response.data));
                   localStorage.setItem("membershipdetails", JSON.stringify(response.data));
                     $scope.plans = response.data;
                    
                  },
                function error(response) {}
            );
  }
  function getFeatures(){
        MemberPlanService.getAllFeatures()
            .then(
                function successCallback(response) {
                    $scope.features = response.data;
                    localStorage.setItem("membershipfeatures", JSON.stringify(response.data));
                      
                  },
                function error(response) {}
            );
  }
  
  $scope.checkFeature = function(featureid,obj){
    for(var i=0;i<obj.membershipFeatures.length;i++) {
      if(obj.membershipFeatures[i].feature.id==featureid){
        return true;
      }
    } 
  }

 $scope.setActiveMembership = function(){
  /* alert("setActiveMembership");*/
    if ($scope.statusCookie == 'Active') {
       var plans = JSON.parse(localStorage.getItem("membershipdetails"));
        for(var i=1;i<=plans.length-1;i++){
          if($rootScope.points>=plans[i-1].pointMin && $rootScope.points<plans[i].pointMin){
              $("#membershipdiv_"+plans[i-1].id).addClass("featured");
              break;
          }
        }

        if($rootScope.points>=plans[plans.length-1].pointMin){ // for last plan
                $("#membershipdiv_"+plans[plans.length-1].id).addClass("featured");
                    }
     }
       else{ 
         $("div[id*='membershipdiv_']").removeClass("featured");
       }
  }
 
}]);
