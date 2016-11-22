angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB) {
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
})
