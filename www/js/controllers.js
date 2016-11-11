// Each screen has its own controller
angular.module('starter.controllers', [])

// Controller for the settings view
.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

// Controller for the map view
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $cordovaDeviceOrientation) {

  document.addEventListener("deviceready", function () {

    // Get current position once
    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(
        function(position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // Set map options and style
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
            "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#bae5a6" }]
          }, {
            "featureType": "road", "elementType": "all", "stylers": [{ "weight": "1.00" }, { "gamma": "1.8" }, { "saturation": "0" }]
          }, {
            "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ffb200" }]
          }, {
            "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "lightness": "0" }, { "gamma": "1" }]
          }, {
            "featureType": "transit.station.airport", "elementType": "all", "stylers": [{ "hue": "#b000ff" }, { "saturation": "23" }, { "lightness": "-4" }, { "gamma": "0.80" }]
          }, {
            "featureType": "water", "elementType": "all", "stylers": [{ "color": "#a0daf2" }]
          }, {
            "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "hue": "#ff0000" }]
          }, {
            "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff3200" }, { "visibility": "on" }]
          }]
        };

        // Add map to the application scope
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // https://developers.google.com/maps/documentation/javascript/symbols
        // Using an SVG (vector) path instead of an image as a marker
        var marker = new google.maps.Marker({
        // Set the marker at the center of the map
          position: $scope.map.getCenter(),
          icon: {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            strokeColor: '#f65338',
            strokeWeight: 5,
            scale: 3,
            rotation: 0
          },
          draggable: true,
          map: $scope.map
        }); // End marker

        // ngCordova Geolocation options
        var posOptions = {
          timeout: 500,
          enableHighAccuracy: true
        };

        var watchPos = $cordovaGeolocation.watchPosition(posOptions);
        watchPos.then(
          null,
          function(error) {
            alert(error.message);
          },
          function(position) {
            // Create a Google Maps LatLng centered on the ngCordova position
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.map.setCenter(latLng);

            $cordovaDeviceOrientation
            .getCurrentHeading()
            .then(
              function(result) {
                var magneticHeading = result.magneticHeading;
                var trueHeading = result.trueHeading;
                var accuracy = result.headingAccuracy;
                var timeStamp = result.timestamp;
                var trueHeading = result.trueHeading;

                marker.setMap(null);
                marker = new google.maps.Marker({
                  // Set the marker at the center of the map
                  position: $scope.map.getCenter(),
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                    strokeColor: '#f65338',
                    strokeWeight: 5,
                    scale: 3,
                    rotation: trueHeading
                  }, // End icon
                  draggable: true,
                  map: $scope.map
               }); // End marker
              }, // End getCurrentHeading then success
              function(error) {
                alert(error.message);
              } // End getCurrentHeading then error
            ); // End getCurrentHeading then
          }, // End watchPosition then succes
          function(error) {
            alert(error.message);
          } // End watchPosition then error
        ); // End watchPosition then
      } // End getCurrentPosition then success
    ); // End getCurrentPosition then
  }); // Add devideready
}) // End MapCtrl

// Controller for the friends view
.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
  $scope.remove = function(friend) {
    Friends.remove(friend);
  };
})
