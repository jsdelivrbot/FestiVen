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
