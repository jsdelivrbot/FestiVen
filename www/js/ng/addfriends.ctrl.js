angular.module('starter.controllers')


.controller('AddFriendsCtrl', function(ngFB) {

  var vm = this;

  vm.fbFriends = [];

  var getFbFriends = function(){
    ngFB.api({path: '/me/friends'})
      .then(function(friends){
        vm.fbFriends = friends.data;
      });
  }


  getFbFriends();
})
