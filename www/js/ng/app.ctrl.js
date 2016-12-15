angular.module('starter.controllers')
.controller('appController', function(ngFB, UserService, $timeout, $scope) {

  $scope.success = "";
  $scope.showSuccessMessage = false;

  $scope.$on('successPopup', function(_, message){
    console.log('Popup');
    $scope.success = message;
    $scope.showSuccessMessage = true;
    $timeout(function() {
      $scope.showSuccessMessage = false;
      $scope.success = "";
    }, 3000);
  });

  $scope.closePopup = function(){
    $scope.showSuccessMessage = false;
  }



})
