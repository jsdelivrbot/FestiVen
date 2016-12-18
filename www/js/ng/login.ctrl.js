angular.module('starter.controllers')
.controller('LoginCtrl', function($state, ngFB, $ionicLoading, LoginService, toasty, $window) {
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

  vm.checkLoggedIn = function() {
    //If fbAccessToken is not null
    vm.show($ionicLoading);
    if(LoginService.isAuthenticated()) {
      // Send a request with the fb auth token, and see if there is an error

      ngFB.api({
        path: '/me',
        params: {
          fields: 'id, name'
        }
      }).then(function(data){
        // Stop the animation
        vm.hide($ionicLoading);

        // Go to the map view
        $state.go('tab.map');

      }, function(error){
        // If there is an error we need to login again
        // This means the fb auth token has expired
        $window.localStorage.removeItem('id');
        $window.localStorage.removeItem('name');
        $window.localStorage.removeItem('fbAccessToken');
        $window.sessionStorage.removeItem('fbAccessToken');
        vm.login();
      })



    } else {
      //If fbAccessToken hasn't been created, try logging in
      vm.login();
    }
  }

  vm.login = function(){
    LoginService.login().then(function(result){
      vm.hide($ionicLoading);
      $state.go('tab.map');
    }, function(error){
      toasty.error({
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

  //vm.checkLoggedIn();

})
