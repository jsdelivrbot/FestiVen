angular.module('starter.controllers')
.controller('FriendsCtrl', function(ngFB, UserService, $timeout) {
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

  var pollFriends = function(){
    getFriends();
    $timeout(pollFriends, 2000);
  }
  pollFriends();



})
