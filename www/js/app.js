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
      // org.apache.cordova.statusbar required
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
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
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
    url: '/addFriends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-add-friends.html',
        controller: 'AddFriendsCtrl as vm'
      }
    }
  })

  // .state('tab.requests', {
  //   url: '/requests',
  //   views: {
  //     'tab-friends': {
  //       templateUrl: 'templates/tab-requests.html',
  //       controller: 'RequestsCtrl'
  //     }
  //   }
  // })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl as vm'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');


});

angular.module('starter')

.directive('friendAddButton', function() {
    return {
        restrict: 'AEC',
        templateUrl: '/templates/add-friend-btn.html',
        controller: function($scope, $element, $rootScope, $http) {
          $scope.addFriend = function(id){
            $http.post('http://188.166.58.138:3000/api/addrequest',
            {
              origin: $rootScope.id,
              to: id
            })
            .then(function(result){
              // Success message
              $element.html('Added');
            }, function(error){
              // Keep the dom as it is
              // Error message
            });

          }
        }
    };
});

angular.module('starter.services')

.service('UserService', function() {

//for the purpose of this example I will store user data on ionic local storage but you should save it on a database

  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});

angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $document) {
  var vm = this;

  vm.fbFriends = [];
  var getFbFriends = function() {
    // Ask the database for the user's friends
    ngFB.api({
      path: '/me/friends'
    })
    .then(function(friends) {
      // Add the user's friends to the viewmodel
      vm.fbFriends = friends.data;
    });
  }

  getFbFriends();

    // Change the dom INSTANTLY from button to text, so that the user cannot send multiple requests


})

angular.module('starter.controllers')
.controller('FriendsCtrl', function(ngFB) {
  var vm = this;

  vm.fBfriends = [];

  var getFriends = function() {
    // Ask the database for the user's friends
    ngFB.api({
      path: '/me/friends'
    })
    .then(function(friends){
      console.log(friends);
    });
  }

  getFriends();
})

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
            setToken(response);
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

angular.module('starter.controllers')

// Controller for the map view
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $cordovaDeviceOrientation) {

  //document.addEventListener("deviceready", function() {

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

        // Add map to the application scope
        $scope.map = map;

        // Remove spinner when the map is loaded
        google.maps.event.addListenerOnce(map, 'idle', function() {
          $(".center").fadeOut();
        });

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

// Controller for the settings view
.controller('SettingsCtrl', function(ngFB, $rootScope) {
  var vm = this;
  vm.name = $rootScope.name;

  vm.settings = {
    enableFriends: true
  };
})
