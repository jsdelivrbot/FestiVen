angular.module('starter.controllers')
// Controller for the settings view
.controller('SettingsCtrl', function(ngFB, $rootScope, $window) {
  var vm = this;
  vm.name = $window.localStorage.getItem('name');

  vm.settings = {
    enableFriends: true
  };
})
