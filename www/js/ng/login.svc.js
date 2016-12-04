angular.module('starter.services')
// The $window service is a reference to the browser's window object
// The $http service facilitates communication with the remote HTTP server
// The $state service
// The UserService service contains all user functionalities
// The $q service helps run functions asynchronously
// The ngFB contains all Facebook functionalities
.service('LoginService', function($window, $http, $state, UserService, $q, ngFB) {

  // Check whether the current login is still valid
  this.isValidByTime = function() {
    alert('time');
    var date = $window.localStorage.getItem('createdAt');
    var now = new Date();

    // Date was stored in ms in localStorage
    if (date != undefined && date != null){
      var diff = now.getTime() - date;

      var msIn5days = 1000 * 60 * 60 * 24 * 5

      if(diff < msIn5days) {
        return true;
      }
    }
    return false;
  }

  // Check whether there is a user currently logged in
  this.isAuthenticated = function() {
    // Get fbAccessToken from localStorage
    var token = $window.localStorage.getItem('fbAccessToken');
    // Check whether token is null
    var found = (token !== null && token !== "");

    if(found){
      $window.sessionStorage.setItem('fbAccessToken', token);
    }
    return found;
  }

  var registered = undefined;

  this.login = function() {
    var deferred = $q.defer();
    ngFB.login({
      // Try to log in and ask for the user's email, friends and profile permissions
      scope: 'email, user_friends, public_profile'
    })
    // After trying to log in
    .then(function(response) {
      // On succesful login
      if(response.status === 'connected') {
        // Get the user's id and name
        UserService.getInfo().then(function(data) {
          console.log(data);
          // Try to register the user
          $http.post('http://188.166.58.138:8080/api/register', {
            id: data.id,
            name: data.name
          }).then(function(result) {
            // User is succesfully registered
            registered = result;
            deferred.resolve(registered);
          }, function(error) {
            alert("error -registering");
            // Popup with error message
            // Show the login screen
            registered = error;
            deferred.reject(error);
          })
        }, function(error){
          alert("error - getting info");
          registered = error;
          deferred.reject(error);
        })
        setToken(response);
      } else {
        var error = { error: "Couldn't login with facebook" };
        console.log('fb-login');
        console.log(error);
        registered = error;
        deferred.reject(error);
      }
    })
    registered = deferred.promise;
    return $q.when(registered);
  }

  var setToken = function(response) {
    // Set fbAccessToken to local and session storage
    $window.localStorage.setItem('fbAccessToken', response.authResponse.accessToken);
    $window.sessionStorage.setItem('fbAccessToken', response.authResponse.accessToken);
  }

});
