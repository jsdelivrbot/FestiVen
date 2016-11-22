angular.module('starter.controllers')

// Controller for the settings view
.controller('SettingsCtrl', function(ngFB, $rootScope) {
  var vm = this;
  vm.name = $rootScope.name;

  vm.settings = {
    enableFriends: true
  };
})
