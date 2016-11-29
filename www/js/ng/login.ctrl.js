angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, ngFB, $ionicLoading, LoginService, UserService) {
  var vm = this;

  vm.show = function() {
    $ionicLoading.show({
      template: '<div class="center"><div class="spinner spinner-1"></div></div>'
    });
  };

  vm.hide = function(){
      $ionicLoading.hide();
  };

  var checkLoggedIn = function() {
    //If fbAccessToken is not null
    vm.show($ionicLoading);
    if(LoginService.isAuthenticated() && LoginService.isValidByTime()) {
      LoginService.login().then(function(result){
        console.log(result);
        // Popup successfully logged in
        $state.go('tab.map');
      }, function(error){
        console.log(error);
        // Popup not successfully logged in
        $state.go('login');
      })

    } else {
      //If fbAccessToken hasn't been created, try logging in
      LoginService.login().then(function(result){
        console.log(result);
        // Popup successfully logged in
        $state.go('tab.map');
      }, function(error){
        console.log(error);
        // Popup not successfully logged in
        $state.go('login');
      })
    }
  }

  checkLoggedIn();

})
