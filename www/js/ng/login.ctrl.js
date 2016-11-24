angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, $ionicModal, $timeout, ngFB, UserService, $http, $rootScope) {
  var vm = this;

  var isAuthenticated = function() {
    // Get fbAccessToken from localStorage
    var token = localStorage.getItem('fbAccessToken');
    //sessionStorage.setItem('fbAccessToken', token);
    // Check whether token is not null
    var found = (token !== null && token !== "");
    return found;
  }

  var checkLoggedIn = function() {
    console.log("Checking if logged in")
    // If fbAccessToken is not null
    //if(isAuthenticated()) {
      // Get user's id and name
      // ngFB.api({
      //   path: '/me',
      //   params: {
      //     fields: 'id, name'
      //   }
      // }).then(function(data) {
      //   // Set the user's id and name to the rootScope
      //   $rootScope.name = data.name;
      //   $rootScope.id = data.id;
      //   // Show the map screen
      //   $state.go('tab.map');
      // })

      vm.fbLogin();

    //} else {
      //console.log("Couldn't find the logged in token")
      // If fbAccessToken hasn't been created, try logging in

    //}
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
            // Register the iser to the database by POSTing name and id
            $http.post('http://188.166.58.138:3000/api/register', {
              id: data.id,
              name: data.name
            });
            // Set id and name of logged in user to rootScope
            // Only needed once on login
            $rootScope.name = data.name;
            $rootScope.id = data.id;
          })
          .then(function(result) {
            // Success popup
            // Save the fbAccessToken to local and session storage
            //setToken(response);
            // Show the map screen
            $state.go('tab.map');
          }, function(error) {
            // Popup with error message
            // Show the login screen
            $state.go('login');
          });
        } else {
          // On login fail
          // Show the login screen
          $state.go('login');
        }
      }
    )
  }

  var setToken = function(response) {
    // Set fbAccessToken to local and session storage
    localStorage.setItem('fbAccessToken', response.authResponse.accessToken);
    //sessionStorage.setItem('fbAccessToken', response.authResponse.accessToken);
  }

  checkLoggedIn();

})
