angular.module('starter.controllers')
// Controller for the map view
.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $cordovaDeviceOrientation, $ionicLoading, socket, $window, $timeout, $q, MarkerService) {

  var map = null;
  var currentPosition = null;
  var latLng = null;
  var lat = null;
  var long = null;
  var friendsMarkers = [];
  var sharedMarkers = [];

  $scope.radio = {radioValue: 'marker'};

  $scope.placeMarker = false;

  $scope.cancelPlace = function(){
    $scope.placeMarker = false;
  }

  $scope.deleteMarker = function(id){
    MarkerService.deleteMarker(id).then(function(result){
      // Show success message
    }, function(err){
      // Do some error handling
    })
  }

  $scope.addMarker = function(){
    var coords = $scope.map.getCenter();
    var coordinates = {
      lat: coords.lat(),
      lng: coords.lng()
    }

    console.log('Type of marker at type of creation: ', this.radio);

    var myObj = {
      coords: coordinates,
      markerType: $scope.radio.radioValue
    }

    $state.go('tab.friendSelection',{obj: myObj});
    $scope.placeMarker = false;
  }



  var colours =
  [
    '#1abc9c', '#2ecc71', '#f1c40f', '#c0392b', '#2c3e50', '#9b59b6', '#8e44ad', '3b5999', '410093', '4E342E'
  ]

  var getSharedMarkers = function(){
    MarkerService.getMarkers().then(function(result){
      console.log(result);
      result.data.forEach(function(marker){

        var markerIndex = getMarkerIndex(marker._id, sharedMarkers);

        if (markerIndex == -1){
          var newLatLng = new google.maps.LatLng(marker.location[0], marker.location[1]);

          console.log("Type of marker: ", marker.type);

          var myIcon = new google.maps.MarkerImage('../img/icons/' + marker.type + '_orange.svg', null, null, null, new google.maps.Size(32,32));

          var newMarker = new google.maps.Marker({
            position: newLatLng,
            draggable: false,
            map: $scope.map,
            icon: myIcon
          });
          var contentString = '';

          if (marker.owner.id === $window.localStorage.getItem('id')){
            var content_text = '<p>You are the owner of this marker.<p>'

            contentString = '<div id="content"><div><div>' + content_text + '<p>Press "Delete" if you want to get rid of this marker.</p></div><div><button class="info-delete" ng-click="deleteMarker(' + marker._id + ')">Delete</button></div></div></div>';
          }
          else {
            var content_text = '<div id="content">This marker was shared by ' + marker.owner.name + '</div>';

            contentString = '<div id="content"><div><div>' + content_text + '<p>Press "Delete" if you want to get rid of this marker.</p></div><div><button class="info-delete" ng-click="deleteMarker()">Delete</button></div></div></div>';

          }


          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          newMarker.addListener('click', function() {
            infowindow.open(map, newMarker);
          });

          newMarker.setValues({id: marker._id});

          sharedMarkers.push(newMarker);
        }
      })
    }, function(error){
      // Do some error handling
    })

    $timeout(getSharedMarkers, 2000);
  }

  //document.addEventListener("deviceready", function() {

  // Connect to socket - maybe move this to success in login controller
  var socket = io.connect('http://188.166.58.138:8080');

    // Emit on connect, store the fb id in socket
    socket.on('connect', function (data) {
        socket.emit('storeClientInfo', { customId: $window.localStorage.getItem('id')});
    });

    // Show the spinner
    $scope.show = function() {
      $ionicLoading.show({
        showBackdrop: false,
        template: '<div class="center"><div class="spinner spinner-1 spinner-roskilde"></div></div>'
      });
    };

    // Hide the spinner
    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.show($ionicLoading);


    var getMarkerIndex = function(id, markerArray){
      for (var i = 0; i < markerArray.length; i++){
        if (markerArray[i].get('id') == id){
          return i;
        }
      }
      return -1;
    }



    socket.on('start-transmit', function(data){
      var emitLocation = function(){
        if (latLng !== null){

          socket.emit('sendLocation', {
            location: {
              latitude: lat,
              longitude: long
            },
            id: $window.localStorage.getItem('id'),
            name: $window.localStorage.getItem('name')
          });
        }
        $timeout(emitLocation, 2000);
      }
      emitLocation();
    })

    socket.on('receive-location', function(data){
      if (map !== null){
        var newLatLng = new google.maps.LatLng(data.location.latitude, data.location.longitude);

        var markerIndex = getMarkerIndex(data.id, friendsMarkers);

        if (markerIndex != -1){
          friendsMarkers[markerIndex].setPosition(newLatLng);
          //friendsMarkers.splice(markerIndex, 1);
        }
        else {
          var colourIndex = data.id.substr(data.id.length - 1);

          var newMarker = new google.maps.Marker({
          // Set the marker at the center of the map
            position: newLatLng,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              strokeColor: colours[colourIndex],
              strokeWeight: 0,
              fillColor: colours[colourIndex],
              fillOpacity: 1,
              scale: 6,
              rotation: 0
            },
            draggable: false,
            map: $scope.map
          });

          var contentString = '<div id="content">' + data.name + '</div>';

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          newMarker.addListener('click', function() {
            infowindow.open(map, newMarker);
          });
          infowindow.open(map, newMarker);

          newMarker.setValues({id: data.id});
          friendsMarkers.push(newMarker);
        }
        $timeout(function(){
          var index = getMarkerIndex(data.id, friendsMarkers);
          var pos = friendsMarkers[index].getPosition();

          if (pos.lat() == data.location.latitude && pos.lng() == data.location.longitude){
              // This means the person with this id, hasn't transmitted his/her location in 5 seconds

              // We will get rid of the marker
              friendsMarkers.splice(index, 1);
          }
        }, 5000)
      }
    })

    socket.on('delete-location', function(data){
      var markerIndex = getMarkerIndex(data, friendsMarkers);

      if (markerIndex != -1){
        friendsMarkers.splice(markerIndex, 1);
      }
    })

    // Center the map on the current location
    $(".center-map").click(function() {
      if(map && currentPosition) {
        // Buggy when clicked before all tiles are loaded
        map.panTo(currentPosition);
      }
    });

    // Set the current position once the first time
    var singleOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    //$scope.show($ionicLoading);

    $cordovaGeolocation
    .getCurrentPosition(singleOptions).then(
      function(position) {

        // Get current position once
        latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        currentPosition = latLng;
        lat = position.coords.latitude;
        long = position.coords.longitude;

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
          //getSharedMarkers();
        })

        google.maps.event.addListener(map, "click", function(event){
          $scope.placeMarker = true;
        })

        // Add map to the application scope
        $scope.map = map;

        // Create a new marker using an SVG (vector) path
        var marker = new google.maps.Marker({
        // Set the marker at the center of the map
          position: $scope.map.getCenter(),
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: '#fff',
            strokeWeight: 0,
            strokeOpacity: 1,
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
          timeout: 500,
          //frequency: 100,
          enableHighAccuracy: true
        };

        var poll = function(){
          $q.all([
            $cordovaGeolocation.getCurrentPosition(posOptions),
            $cordovaDeviceOrientation.getCurrentHeading()
          ]).then(function(data){
            var position = data[0];
            var heading = data[1];

            // Create a Google Maps LatLng centered on the ngCordova position
            latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            currentPosition = latLng;
            lat = position.coords.latitude;
            long = position.coords.longitude;
            // Change the marker's position whenever the user's location changes
            marker.setPosition(latLng);

            var trueHeading = heading.trueHeading;
            marker.setIcon({
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor: '#f65338',
              strokeWeight: 0,
              fillColor: '#f65338',
              fillOpacity: 1,
              scale: 6,
              rotation: trueHeading
            })

          })
          $timeout(poll, 500);
        }
        poll();

      } // End getCurrentPosition then success
    ); // End getCurrentPosition then
  //}); // End deviceready
}) // End MapCtrl
