angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $document, $q, $window, $state) {
  var vm = this;
  vm.filteredFriends = [];
  vm.getFbFriends = function() {
    // Ask the database for the user's friends

      // Get the people that are not friends yet and you are friends with on facebook

      // API Request to get list of sent requests
      var myId = $window.localStorage.getItem('id');
      console.log(myId);
      $q.all([
        $http.post('http://188.166.58.138:3000/api/user/sent', {
          id: myId
        }),
        ngFB.api({path: '/me/friends'})
      ]).then(function(data){
        var requests = data[0];
        console.log(requests);
        var fbFriends = data[1];
        console.log(fbFriends);


        vm.filteredFriends = showUnique(requests.data, fbFriends.data);
      })

  }

  var showUnique = function(req, fb) {
    var filtered = [];
    // Loop over fb array first
    for (i = 0; i < fb.length; i++){
      var found = false;
      for (j = 0; j < req.length; j++){

        if (req[j].id == fb[i].id){
          found = true;
        }
      }
      if (!found){
        filtered.push(fb[i]);
      }

    }
    return filtered;

  }

  vm.getFbFriends();

  vm.goBack = function(){
    $state.go('tab.friends');
  }

    // Change the dom INSTANTLY from button to text, so that the user cannot send multiple requests


})
