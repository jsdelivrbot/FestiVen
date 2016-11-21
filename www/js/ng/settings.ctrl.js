angular.module('starter.controllers')

// Controller for the settings view
.controller('SettingsCtrl', function(ngFB) {
  var vm = this;

  vm.settings = {
    enableFriends: true
  };
})
