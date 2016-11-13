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

  //document.addEventListener("deviceready", function () {

    var singleOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    $cordovaGeolocation
    .getCurrentPosition(singleOptions)
      .then(
        function(position) {

        // Get current position once
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // Set map options
        var mapOptions = {
          // Set map center to current position
          center: latLng,
          clickableIcons: false,
          zoom: 18,
          minZoom: 17,
          maxZoom: 20,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
          {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [{
              "visibility": "simplified"
            }, {
              "weight": "2.32"
            }, {
              "lightness": "56"
            }, {
              "saturation": "-26"
            }]
          }, {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [{
              "visibility": "simplified"
            }]
          }, {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "simplified"
            }, {
              "weight": "2.11"
            }, {
              "gamma": "1.07"
            }]
          }, {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [{
              "visibility": "simplified"
            }, {
              "color": "#5b6571"
            }, {
              "lightness": "35"
            }]
          }, {
            "featureType": "administrative.neighborhood",
            "elementType": "all",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "landscape",
            "elementType": "geometry.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#ff0000"
            }]
          }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [{
              "weight": 0.9
            }, {
              "visibility": "off"
            }]
          }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "simplified"
            }]
          }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "simplified"
            }]
          }, {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#83cead"
            }]
          }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#ffffff"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels.text",
            "stylers": [{
              "visibility": "on"
            }, {
              "weight": "0.41"
            }, {
              "color": "#92936f"
            }]
          }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#fee379"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.text",
            "stylers": [{
              "visibility": "on"
            }]
          }, {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [{
              "visibility": "simplified"
            }, {
              "color": "#ffffff"
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#9a9b83"
            }]
          }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#7fc8ed"
            }]
          }]
        };

        // Create a map with the given options
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Add map to the application scope
        $scope.map = map;

        // https://developers.google.com/maps/documentation/javascript/symbols
        // Create a new marker using an SVG (vector) path
        var marker = new google.maps.Marker({
        // Set the marker at the center of the map
          position: $scope.map.getCenter(),
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: '#f65338',
            fillColor: '#f65338',
            fillOpacity: 1,
            scale: 4,
            rotation: 0
          },
          draggable: false,
          map: map
        });

        // ngCordova Geolocation options
        var posOptions = {
          timeout: 10000,
          frequency: 100,
          enableHighAccuracy: true
        };

        var watchPos = $cordovaGeolocation.watchPosition(posOptions);
        watchPos.then(
          null,
          function(error) {
            alert("watchPosition error " + error.message);
          },
          function(position) {

            // Create a Google Maps LatLng centered on the ngCordova position
            var latLng = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);


            $scope.map.setCenter(latLng);

            $cordovaDeviceOrientation
            .getCurrentHeading()
            .then(
              function(result) {
                var trueHeading = result.trueHeading;

                marker.setMap(null);
                marker = new google.maps.Marker({
                  // Set the marker at the center of the map
                  position: $scope.map.getCenter(),
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: '#f65338',
                    fillColor: '#f65338',
                    fillOpacity: 1,
                    scale: 4,
                    rotation: trueHeading
                  }, // End icon
                  draggable: false,
                  map: $scope.map
               }); // End marker
              }, // End getCurrentHeading then success
              function(error) {
                alert("getCurrentHeading error: " + error);
              } // End getCurrentHeading then error
            ); // End getCurrentHeading then
          } // End watchPosition then succes
        ); // End watchPosition then
      } // End getCurrentPosition then success
    ); // End getCurrentPosition then
  //}); // Add devideready
}) // End MapCtrl

// Controller for the friends view
.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
  $scope.remove = function(friend) {
    Friends.remove(friend);
  };
})
