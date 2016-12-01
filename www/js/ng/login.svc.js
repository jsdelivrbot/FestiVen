angular.module('starter.services')

.service('LoginService', function($window, $http, $state, UserService, $q, ngFB) {

  this.isValidByTime  = function(){
    alert('time');
    var date = $window.localStorage.getItem('createdAt');
    var now = new Date();

    // Date was stored in ms in localStorage
    if (date != undefined && date != null){
      var diff = now.getTime() - date;

      var msIn5days = 1000 * 60 * 60 * 24 * 5

      if (diff < msIn5days){
        return true;
      }
    }

    return false;
  }

  this.isAuthenticated = function() {
    // Get fbAccessToken from localStorage
    var token = $window.localStorage.getItem('fbAccessToken');

    // Check whether token is not null
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
      // Try to log in and ask for user email, friends and profile permissions
      scope: 'email,user_friends,public_profile'
    })
    .then(function(response) {
        // On succesful login
        if(response.status === 'connected') {
          // Get the user's id and name


          UserService.getInfo().then(function(data){
            console.log(data);
            $http.post('http://188.166.58.138:3000/api/register', {
              id: data.id,
              name: data.name
            }).then(function(result) {
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
          var error = {error: "Couldn't login with facebook"};
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
