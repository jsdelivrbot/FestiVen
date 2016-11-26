angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, $ionicModal, $timeout, ngFB, UserService, $http, $rootScope, $ionicLoading, $window) {
  var vm = this;

  vm.show = function() {
    $ionicLoading.show({
      template: '<div class="center"><div class="spinner spinner-1"></div></div>'
    });
  };

  vm.hide = function(){
      $ionicLoading.hide();
  };

  var isValidByTime  = function(){
    var date = $window.localStorage.getItem('createdAt');
    var now = new Date();

    // Date was stored in ms in localStorage
    var diff = now.getTime() - date;

    var msIn5days = 1000 * 60 * 60 * 24 * 5

    if (diff >= msIn5days){
      return false;
    }
    return true;
  }

  var isAuthenticated = function() {
    // Get fbAccessToken from localStorage
    var token = $window.localStorage.getItem('fbAccessToken');
    $window.sessionStorage.setItem('fbAccessToken', token);
    // Check whether token is not null
    var found = (token !== null && token !== "");
    return found;
  }

  var checkLoggedIn = function() {
    //If fbAccessToken is not null
    if(isAuthenticated() && isValidByTime()) {
      vm.show($ionicLoading);
      //Get user's id and name
      ngFB.api({
        path: '/me',
        params: {
          fields: 'id, name'
        }
      }).then(function(data) {
        //Set the user's id and name to the local storage
        $window.localStorage.setItem('name', data.name);
        $window.localStorage.setItem('id', data.id);

        // Show the map screen
        $state.go('tab.map');
      })

      vm.fbLogin();

    } else {
      //If fbAccessToken hasn't been created, try logging in
      vm.fbLogin();
    }
  }

  vm.fbLogin = function() {

    ngFB.login({
      // Try to log in and ask for user email, friends and profile permissions
      scope: 'email,user_friends,public_profile'
    })
    .then(
      // Success
      function(response) {
        // On succesful login
        if(response.status === 'connected') {
          // Get the user's id and name

          ngFB.api({
            path: '/me',
            params: {
              fields: 'id, name'
            }
          })
          .then(function(data) {
            $window.localStorage.setItem('createdAt', (new Date()).getTime());
            $window.localStorage.setItem('name', data.name);
            $window.localStorage.setItem('id', data.id);
            // Register the user to the database by POSTing name and id
            $http.post('http://188.166.58.138:3000/api/register', {
              id: data.id,
              name: data.name
            }).then(function(result) {
              $state.go('tab.map');
            }, function(error) {
              // Popup with error message
              // Show the login screen
              $state.go('login');
            });
            // Set id and name of logged in user to rootScope
            // Only needed once on login

          })
          .then(function(result) {
            $state.go('tab.map');
          }, function(error) {
            // Popup with error message
            // Show the login screen
            $state.go('login');
          }).finally(function($ionicLoading) {
            // On both cases hide the loading
            //vm.hide($ionicLoading);
          })


          setToken(response);
        } else {
          // On login fail
          // Show the login screen
          $state.go('login');

        }
      }
    ).then(function(result) {
      $state.go('tab.map');
    }, function(error) {
      // Popup with error message
      // Show the login screen
      $state.go('login');
    }).finally(function($ionicLoading) {
      // On both cases hide the loading
      //vm.hide($ionicLoading);
    });
  }

  var setToken = function(response) {
    // Set fbAccessToken to local and session storage
    localStorage.setItem('fbAccessToken', response.authResponse.accessToken);
    sessionStorage.setItem('fbAccessToken', response.authResponse.accessToken);
  }

  checkLoggedIn();

})
