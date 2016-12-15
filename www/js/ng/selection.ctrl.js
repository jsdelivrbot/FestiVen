angular.module('starter.controllers')
.controller('SelectionCtrl', function(MarkerService, $stateParams, $state, UserService) {
  var vm = this;
  console.log($stateParams);

  var markerType = $stateParams.obj.markerType;
  console.log("Type marker in select ctrl: ", markerType);
  var coords = $stateParams.obj.coords

  vm.friends = [];

  vm.description = "";

  // Array of facebook ids, contains users that are selected
  var sharedWith = [];


  // Init function, called with ngInit in view
  vm.init = function(){
    UserService.getFriends().then(function(result){
      // Set your friends to the scope
      console.log(result);

      //Loop over the array and add a "checked" boolean value
      for (var i = 0; i < result.data.length; i++){
        var user = {
          data: result.data[i],
          checked: false
        }
        vm.friends.push(user);
      }
    })
  }

  vm.sendMarker = function(){
    var people =
    vm.friends
    .filter(function(friend){
      return friend.checked;
    })
    .map(function(friend){
      return friend.data.id;
    })

    console.log("Coords: ", coords);
    console.log("People: ", people);
    console.log("Marker: ", markerType);

    MarkerService.addMarker(coords, people, markerType, vm.description).then(function(result){
      $state.go('tab.map');
    }, function(error){
      $state.go('tab.map');

      // Emit error message to the map views

      toasty.error({
            msg: 'Unable to place the ' + markerType,
            showClose: true,
            clickToClose: true,
            timeout: 5000,
            sound: false,
            html: true,
            shake: false,
            theme: "material"
        });

    })
  }

  vm.cancelMarkerPlacement = function(){
    $state.go('tab.map');
  }






})
