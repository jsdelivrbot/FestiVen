angular.module('starter')
.controller('LoginCtrl', function($ionicAuth, $ionicUser, $rootScope){
  var vm = this;

  vm.login = function(){
    $ionicAuth.login('facebook').then(
      // Get the user_id of the facebook account
      $rootScope.uid = $ionicUser.social.facebook.uid;


      // Check if the user_id already exists
        // YES: Get all the settings and data and Initialize

        // NO: Save the user_id as a user_id and default settings


      $rootScope.data = $ionicAuth.social.facebook.data;



    );
  }

  vm.logout = function(){
    $ionicAuth.logout();
  }
})
