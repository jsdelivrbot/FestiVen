angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MapCtrl', function($scope) {})

.controller('FriendsCtrl', function($scope, Friends) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.friends = Friends.all();
  $scope.remove = function(friend) {
    Friends.remove(friend);
  };
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      clickableIcons: false,
      zoom: 18,
      minZoom: 17,
      maxZoom: 20,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [{
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#bae5a6"
        }]
      }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
          "weight": "1.00"
        }, {
          "gamma": "1.8"
        }, {
          "saturation": "0"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "hue": "#ffb200"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
          "lightness": "0"
        }, {
          "gamma": "1"
        }]
      }, {
        "featureType": "transit.station.airport",
        "elementType": "all",
        "stylers": [{
          "hue": "#b000ff"
        }, {
          "saturation": "23"
        }, {
          "lightness": "-4"
        }, {
          "gamma": "0.80"
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "color": "#a0daf2"
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{
          "hue": "#ff0000"
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
          "hue": "#ff3200"
        }, {
          "visibility": "on"
        }]
      }]
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });
});
