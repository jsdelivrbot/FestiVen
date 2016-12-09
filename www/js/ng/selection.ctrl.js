angular.module('starter.controllers')
.controller('SelectionCtrl', function(MarkerService, $stateParams, $state, UserService) {
  var vm = this;

  var markerType = $stateParams.markerType;
  var coords = $stateParams.coords

  vm.friends = [];

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


    MarkerService.addMarker(coords, people, markerType).then(function(result){
      $state.go('tab.map');
    }, function(error){
      $state.go('tab.map');

      //TODO: Emit error message to the map views

    })
  }

  vm.cancelMarkerPlacement = function(){
    $state.go('tab.map');
  }






})
