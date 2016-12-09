angular.module('starter')

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  $stateProvider

  // Setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl as vm'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.friendSelection', {
    url: '/friend-selection',
    views: {
      'tab-map': {
        templateUrl: 'templates/select-friends.html',
        controller: 'SelectionCtrl as vm',
        params: {
          coords: null,
          markerType: null
        }
      }
    }
  })

  .state('tab.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        cache: false,
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl as vm'
      }
    }
  })
  .state('tab.addFriends', {
    url: '/addFriends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-add-friends.html',
        controller: 'AddFriendsCtrl as vm'
      }
    }
  })

  .state('tab.requests', {
    url: '/requests',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-requests.html',
        controller: 'RequestsCtrl as vm'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl as vm'
  });

  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('none');

});
