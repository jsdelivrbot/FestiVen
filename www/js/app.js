angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngOpenFB'])
angular.module('starter.services', [])
angular.module('starter.controllers', ['ionic', 'starter.services', 'ngOpenFB'])

angular.module('starter')
.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    // Style the keyboard
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    // Style the status bar
    if(window.StatusBar) {
      StatusBar.backgroundColorByHexString("#ec4940");
    }
  });

  ngFB.init({
    appId: 347525672266180
  });
})

angular.module('starter')

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  $stateProvider

  // Setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl as vm'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.friends', {
    cache: false,
    url: '/friends',
    views: {
      'tab-friends': {
        cache: false,
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl as vm'
      }
    }
  })
  .state('tab.addFriends', {
    cache: false,
    url: '/addFriends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-add-friends.html',
        controller: 'AddFriendsCtrl as vm'
      }
    }
  })

  .state('tab.requests', {
    cache: false,
    url: '/requests',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-requests.html',
        controller: 'RequestsCtrl as vm'
      }
    }
  })

  .state('login', {
    cache: false,
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl as vm'
  });

  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('none');

});

angular.module('starter')

.directive('friendButton', function() {
    return {
        // replace: true,
        restrict: 'AEC',
        // templateUrl: function(elem, attr) {
        //   return '/templates/' + attr.type +  '-friend-btn.html';
        // },
        controller: function($scope, $element, $rootScope, $http, $window, UserService) {
          $scope.addFriend = function(id){
            $scope.disabled = false;

            $http.post('http://188.166.58.138:3000/api/addrequest',
            {
              origin: $window.localStorage.getItem('id'),
              to: id
            })
            .success(function(){
              // Success message
              $element.html('Added');
              $scope.disabled = true;
            })
            .error(function(error){
              // Keep the dom as it is
              // Error message
            });
          }


          $scope.acceptRequest = function(id){
            console.log('Accepting request');
            UserService.acceptRequest(id).then(function() {
              $element.parent().html('Accepted');
            });

          }

          $scope.declineRequest = function(id){
            console.log('Decline request');
            UserService.declineRequest(id).then(function() {
              $element.parent().html('Declined');
            });


          }
        }
    };
});

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

angular.module('starter.services')

.service('UserService', function($q, $http, $window, ngFB) {

  var info = undefined;
  var friends = undefined;
  var sent = undefined;
  var received = undefined;
  var accept = undefined;
  var decline = undefined;


  this.acceptRequest = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/acceptRequest',
      {
        from: myId,
        accept_id: id
      }).then(function(result) {
      accept = result;
      deferred.resolve(accept);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      accept = error;
      deferred.reject(error);
    })

    accept = deferred.promise;

    return $q.when(accept);

  }

  this.declineRequest = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/declinerequest',
      {
        from: myId,
        decline_id: id
      }).then(function(result) {
      decline = result;
      deferred.resolve(decline);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      decline = error;
      deferred.reject(error);
    })

    decline = deferred.promise;

    return $q.when(decline);
  }

  this.getFriends = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/user/friends',
      {
        id: myId
      }).then(function(result) {
      friends = result;
      deferred.resolve(friends);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      friends = error;
      deferred.reject(error);
    })

    friends = deferred.promise;

    return $q.when(friends);
  }

  this.getReceived = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/user/received',
      {
        id: myId
      }).then(function(result) {
      received = result;
      deferred.resolve(received);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      received = error;
      deferred.reject(error);
    })

    received = deferred.promise;

    return $q.when(received);

  }

  this.getSent = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/user/sent',
      {
        id: myId
      }).then(function(result) {
      sent = result;
      deferred.resolve(sent);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      sent = error;
      deferred.reject(error);
    })

    sent = deferred.promise;

    return $q.when(sent);

  }

  this.getInfo = function(){
    var deferred = $q.defer();
    ngFB.api({
      path: '/me',
      params: {
        fields: 'id, name'
      }
    }).then(function(data){
      info = data;
      deferred.resolve(info);
      //Set the user's id and name to the local storage
      $window.localStorage.setItem('createdAt', (new Date()).getTime());
      $window.localStorage.setItem('name', data.name);
      $window.localStorage.setItem('id', data.id);
    }, function(error){
      info = error;
      deferred.reject(error);
    })

    info = deferred.promise;

    return $q.when(info);
  }

});

angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $document, $q, $window, $state) {
  var vm = this;
  vm.filteredFriends = [];
  vm.getFbFriends = function() {
    // Ask the database for the user's friends

      // Get the people that are not friends yet and you are friends with on facebook

      // API Request to get list of sent requests
      var myId = $window.localStorage.getItem('id');
      console.log(myId);
      $q.all([
        $http.post('http://188.166.58.138:3000/api/user/sent', {
          id: myId
        }),
        ngFB.api({path: '/me/friends'}),
        $http.post('http://188.166.58.138:3000/api/user/received', {
          id: myId
        }),
        $http.post('http://188.166.58.138:3000/api/user/friends', {
          id: myId
        })
      ]).then(function(data){
        var requests = data[0];
        console.log('sent');
        console.log(requests);
        var fbFriends = data[1];
        console.log('FB');
        console.log(fbFriends);

        console.log('Received');
        var received = data[2];

        console.log('Friends');
        var friends = data[3];

        vm.filteredFriends = showUnique(friends, showUnique(received.data, showUnique(requests.data, fbFriends.data)));
        console.log('FILTERED')
        console.log(vm.filteredFriends);
      })

  }

  var showUnique = function(req, fb) {
    var filtered = [];
    // Loop over fb array first
    for (i = 0; i < fb.length; i++){
      var found = false;
      for (j = 0; j < req.length; j++){

        if (req[j].id == fb[i].id){
          found = true;
        }
      }
      if (!found){
        filtered.push(fb[i]);
      }

    }
    return filtered;

  }

  vm.getFbFriends();

  vm.goBack = function(){
    $state.go('tab.friends');
  }

    // Change the dom INSTANTLY from button to text, so that the user cannot send multiple requests


})

angular.module('starter.controllers')
.controller('FriendsCtrl', function(ngFB, UserService) {
  var vm = this;

  vm.friends = [];

  var getFriends = function() {
    // Ask the database for the user's friends
    UserService.getFriends().then(function(result){
      console.log(result);
      vm.friends = result.data;
    })
  }

  getFriends();
})

angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, ngFB, $ionicLoading, LoginService, UserService, $window) {
  var vm = this;

  // Show the spinner
  vm.show = function() {
    $ionicLoading.show({
      template: '<div class="center"><div class="spinner spinner-1"></div></div>'
    });
  };

  // Hide the spinner
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

angular.module('starter.controllers')

// Controller for the map view
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $cordovaDeviceOrientation, $ionicLoading) {

  //document.addEventListener("deviceready", function() {

  $scope.show = function() {
    $ionicLoading.show({
      template: '<div class="center"><div class="spinner spinner-1"></div></div>'
    });
  };

  $scope.hide = function(){
        $ionicLoading.hide();
  };



    var map = null;

    var currentPosition = null;

    // Center the map on the current location
    $(".center-map").click(function() {
      if(map && currentPosition) {
        // Buggy when clicked before all tiles are loaded
        map.panTo(currentPosition);
      }
    });

    var singleOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    //$scope.show($ionicLoading);


    $cordovaGeolocation
    .getCurrentPosition(singleOptions).then(
      function(position) {

        // Get current position once
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        currentPosition = latLng;

        // Set map options
        var mapOptions = {
          // Set map center to current position
          center: latLng,
          clickableIcons: false,
          zoom: 18,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [{
            "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }]
          }, {
            "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }]
          }, {
            "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }]
          }, {
            "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }]
          }, {
            "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }]
          }, {
            "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
          }, {
            "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }]
          }, {
            "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }]
          }, {
            "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }]
          }, {
            "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }]
          }, {
            "featureType": "water", "elementType": "all", "stylers": [{ "color": "#dde6e8" }, { "visibility": "on" }]
          }]
        };

        // Create a map with the given options
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Remove spinner when the tiles are loaded
        google.maps.event.addListenerOnce(map, "idle", function(event){
          $scope.hide($ionicLoading);
        })

        // Add map to the application scope
        $scope.map = map;

        // Create a new marker using an SVG (vector) path
        var marker = new google.maps.Marker({
        // Set the marker at the center of the map
          position: $scope.map.getCenter(),
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: '#f65338',
            strokeWeight: 0,
            fillColor: '#f65338',
            fillOpacity: 1,
            scale: 6,
            rotation: 0
          },
          draggable: false,
          map: $scope.map
        });


        // ngCordova Geolocation options
        var posOptions = {
          timeout: 3000,
          frequency: 10,
          enableHighAccuracy: true
        };

        var watchPos = $cordovaGeolocation.watchPosition(posOptions);
        watchPos.then(
          null,
          function(error) {
            //alert("watchPosition error " + error.message);
          },
          function(position) {

            // Create a Google Maps LatLng centered on the ngCordova position
            var newLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            currentPosition = newLatLng;
            marker.setPosition(newLatLng);

            $cordovaDeviceOrientation
            .getCurrentHeading().then(
              function(result) {
                var trueHeading = result.trueHeading;
                marker.setIcon({
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: '#f65338',
                  strokeWeight: 0,
                  fillColor: '#f65338',
                  fillOpacity: 1,
                  scale: 6,
                  rotation: trueHeading
                })
              }, // End getCurrentHeading then success
              function(error) {
                //alert("getCurrentHeading error: " + error);
              } // End getCurrentHeading then error
            ); // End getCurrentHeading then
          } // End watchPosition then succes
        ); // End watchPosition then
      } // End getCurrentPosition then success
    ); // End getCurrentPosition then
  //}); // End deviceready
}) // End MapCtrl

angular.module('starter.controllers')
.controller('RequestsCtrl', function(UserService) {
  var vm = this;

  vm.sent = [];
  vm.received = [];

  var getSent = function() {
    // Ask the database for the user's sent friend requests
    UserService.getSent().then(function(result){
      vm.sent = result.data;
    })
  }

  var getReceived = function() {
    // Ask the database for the user's received friend requests
    UserService.getReceived().then(function(result){
      vm.received = result.data;
    })
  }

  getSent();
  getReceived();
})

angular.module('starter.controllers')

// Controller for the settings view
.controller('SettingsCtrl', function(ngFB, $rootScope, $window) {
  var vm = this;
  vm.name = $window.localStorage.getItem('name');

  vm.settings = {
    enableFriends: true
  };
})
