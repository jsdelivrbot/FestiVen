angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, ngFB, $ionicLoading, LoginService, UserService, $window, toasty) {
  var vm = this;

  // Show the spinner
  vm.show = function() {
    $ionicLoading.show({
      template: '<div class="bottom-center"><div class="spinner spinner-1"></div></div>',
      showBackdrop: false
    });
  };

  // Hide the spinner
  vm.hide = function(){
      $ionicLoading.hide();
  };

  var checkLoggedIn = function() {
    //If fbAccessToken is not null
    vm.show($ionicLoading);
    if(LoginService.isAuthenticated()) {
      vm.login();

    } else {
      //If fbAccessToken hasn't been created, try logging in
      vm.login();
    }
  }

  vm.login = function(){
    vm.show($ionicLoading);
    LoginService.login().then(function(result){
      console.log(result);
      // Popup successfully logged in
      vm.hide($ionicLoading);
      $state.go('tab.map');
    }, function(error){
      console.log("LoginService call: ", error);

      toasty.error({
            //title: 'Error on login!',
            msg: 'There was a problem loging in. Please try again.',
            showClose: true,
            clickToClose: true,
            timeout: 5000,
            sound: false,
            html: true,
            shake: false,
            theme: "material"
        });

      // Popup not successfully logged in
      vm.hide($ionicLoading);
      $state.go('login');
    })
  }

  //checkLoggedIn();

})
