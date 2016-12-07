angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $document, $q, $window, $state, $timeout) {
  var vm = this;
  vm.filteredFriends = [];

  vm.getFbFriends = function() {
      // Check localStorage for an id
      var myId = $window.localStorage.getItem('id');
      console.log(myId);
      // For the id in localStorage, get the friends,  sent friend requests and received friend requests
      $q.all([
        $http.get('http://188.166.58.138:8080/api/users/' + myId + '/sent'),
        ngFB.api({path: '/me/friends'}),
        $http.get('http://188.166.58.138:8080/api/users/' + myId + '/received'),
        $http.get('http://188.166.58.138:8080/api/users/' + myId + '/friends')
      ]).then(function(data){
        var requests = data[0];
        console.log('Sent');
        console.log(requests);

        var fbFriends = data[1];
        console.log('FB');
        console.log(fbFriends);

        console.log('Received');
        var received = data[2];

        console.log('Friends');
        var friends = data[3];

        vm.filteredFriends = showUnique(friends.data, showUnique(received.data, showUnique(requests.data, fbFriends.data)));
        console.log('FILTERED')
        console.log(vm.filteredFriends);
      })

  }

  var showUnique = function(req, fb) {
    var filtered = [];

    for (i = 0; i < fb.length; i++) {
      var found = false;
      for (j = 0; j < req.length; j++) {
        if (req[j].id == fb[i].id) {
          found = true;
        }
      }
      if(!found){
        filtered.push(fb[i]);
      }
    }
    return filtered;
  }

  vm.getFbFriends();


  var pollFbFriends = function(){
    vm.getFbFriends();
    $timeout(pollFbFriends, 2000);
  }
  pollFbFriends();


  vm.goBack = function(){
    $state.go('tab.friends');
  }

  // Change the dom INSTANTLY from button to text, so that the user cannot send multiple requests

})
