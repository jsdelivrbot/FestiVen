angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, ngFB, $ionicLoading, LoginService, UserService, $window) {
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
    //vm.show($ionicLoading);
    if(LoginService.isAuthenticated()) {
      vm.login();

    } else {
      //If fbAccessToken hasn't been created, try logging in
      vm.login();
    }
  }

  vm.login = function(){
    LoginService.login().then(function(result){
      console.log(result);
      // Popup successfully logged in
      $state.go('tab.map');
    }, function(error){
      console.log(error);
      alert(error.message);
      // Popup not successfully logged in
      $state.go('login');
    })
  }

  checkLoggedIn();

})
