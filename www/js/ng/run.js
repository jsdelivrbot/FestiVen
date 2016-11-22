angular.module('starter')
.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    // Style the keyboard
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    
    // Style the status bar
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.backgroundColorByHexString("#ec4940");
    }
  });

  ngFB.init({
    appId: 347525672266180
  });
})
