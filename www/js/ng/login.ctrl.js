angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $state, $ionicModal, $timeout, ngFB, UserService, $http, $rootScope) {
  var vm = this;



  var isAuthenticated = function(){
    var token = localStorage.getItem('fbAccessToken');

    sessionStorage.setItem('fbAccessToken', token);

    var found = (token !== null && token !== "");
    return found;
  }

  var checkLoggedIn = function(){
    console.log("Checking if logged in")
    if(isAuthenticated()){
      ngFB.api({
          path: '/me',
          params: {
              fields: 'id, name'
          }
      }).then(function(data){
        $rootScope.name = data.name;
        $rootScope.id = data.id;
        $state.go('tab.map');
      })

    }
    else {
      console.log("Couldn't find the logged in token")
      vm.fbLogin();
    }
  }

  vm.fbLogin = function () {
    ngFB.login({scope: 'email,user_friends,public_profile'}).then(
      // Success
        function (response) {
            if (response.status === 'connected'){

                // Sets token in local storage

                ngFB.api({
                    path: '/me',
                    params: {
                        fields: 'id, name'
                    }
                })
                .then(function(data){
                  $http.post('http://95.85.9.178:3000/api/register', {
                    id: data.id,
                    name: data.name
                  });

                  // Set id and name of logged in person to rootScope
                  // Only needs to get this data once on login
                  $rootScope.name = data.name;
                  $rootScope.id = data.id;
                })
                .then(function(result){
                  // Success popup
                  setToken(response);
                  $state.go('tab.map');
                }, function(error){
                  // Popup with error message
                  $state.go('login');
                });
            }
            else {
                $state.go('login');
            }
        })


  }

  var setToken = function(response){
    localStorage.setItem('fbAccessToken', response.authResponse.accessToken);

    sessionStorage.setItem('fbAccessToken', response.authResponse.accessToken);
  }

  checkLoggedIn();

})
