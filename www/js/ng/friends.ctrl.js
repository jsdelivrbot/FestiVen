angular.module('starter.controllers')

// Controller for the friends view
.controller('FriendsCtrl', function(ngFB) {

  var vm = this;

  vm.friends = [];

  var getFriends = function(){
    ngFB.api({path: '/me/friends'})
      .then(function(friends){
        console.log(friends);
      });
  }


  getFriends();
})
