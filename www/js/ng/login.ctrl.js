angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, $ionicModal, $timeout, ngFB, UserService) {
  var vm = this;

  var isAuthenticated = function(){
    var token = localStorage.getItem('fbAccessToken');

    sessionStorage.setItem('fbAccessToken', token);

    var found = (token !== null && token !== "");
    return found;
  }

  var checkLoggedIn = function(){
    console.log("Checking if logged in")
    if(isAuthenticated()){
      $state.go('tab.map');
    }
    else {
      console.log("Couldn't find the logged in token")
      vm.fbLogin();
    }
  }

  vm.fbLogin = function () {
    ngFB.login({scope: 'email,user_friends,public_profile'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');

                // Sets token in local storage
                setToken(response);


            } else {
                alert('Facebook login failed');
            }
        })
        .then(function(){
          $state.go('tab.map');
        });

  }

  var setToken = function(response){
    localStorage.setItem('fbAccessToken', response.authResponse.accessToken);

    sessionStorage.setItem('fbAccessToken', response.authResponse.accessToken);
  }

  checkLoggedIn();

})
