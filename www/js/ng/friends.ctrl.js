angular.module('starter.controllers')
.controller('FriendsCtrl', function(ngFB, UserService, $timeout, toasty) {
  var vm = this;

  vm.friends = [];

  var pollFriends = function(){
    // Ask the database for the user's friends
    UserService.getFriends().then(function(result){
      vm.friends = result.data;
      // Only keep polling if there were no errors
      $timeout(pollFriends, 2000);
    }, function(error){
      toasty.error({
            msg: 'Unable to get your friends.' ,
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
  pollFriends();



})
