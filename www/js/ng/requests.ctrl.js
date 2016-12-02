angular.module('starter.controllers')
.controller('RequestsCtrl', function(UserService) {
  var vm = this;

  vm.sent = [];
  vm.received = [];

  var getSent = function() {
    // Ask the database for the user's sent friend requests
    UserService.getSent().then(function(result){
      vm.sent = result.data;
    })
  }

  var getReceived = function() {
    // Ask the database for the user's received friend requests
    UserService.getReceived().then(function(result){
      vm.received = result.data;
    })
  }

  getSent();
  getReceived();
})
