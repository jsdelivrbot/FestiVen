angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])
angular.module('starter.controllers', [])

angular.module('starter')


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
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
        controller: 'SettingsCtrl'
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
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');

});

angular.module('starter.controllers')

// Controller for the friends view
.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
  $scope.remove = function(friend) {
    Friends.remove(friend);
  };
})

angular.module('starter.controllers')

// Controller for the map view
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $cordovaDeviceOrientation) {

  var map = null;
  var currentPosition = null;

  // Center the map on the current location
  $(".center-map").click(function() {
    if(map && currentPosition) {
      // Buggy when clicked before all tiles are loaded
      map.panTo(currentPosition);
    }
  });

  //document.addEventListener("deviceready", function() {

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
.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
