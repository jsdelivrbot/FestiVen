angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $document, $q, $window, $state, $timeout) {
  var vm = this;
  vm.filteredFriends = [];

  vm.getFbFriends = function() {
      // Check localStorage for an id
      var myId = $window.localStorage.getItem('id');
      // For the id in localStorage, get the friends,  sent friend requests and received friend requests
      $q.all([
        $http.get('http://188.166.58.138:8080/api/users/' + myId + '/sent'),
        ngFB.api({path: '/me/friends'}),
        $http.get('http://188.166.58.138:8080/api/users/' + myId + '/received'),
        $http.get('http://188.166.58.138:8080/api/users/' + myId + '/friends')
      ]).then(function(data){
        var requests = data[0].data;
        var fbFriends = data[1].data;
        var received = data[2].data;
        var friends = data[3].data;

        // Filter out the facebook friends that either
        //    1. You sent a request to already
        //    2. You received a request from already
        //    3. Are already you friends

        vm.filteredFriends = fbFriends.filter(function(friend){
          return !(containsFriend(requests, friend) ||
                   containsFriend(received, friend) ||
                   containsFriend(friends, friend));
        })
      })

  }

  // Helper function that checks if the array contains a friend object with an id of the facebook friend
  var containsFriend = function(array, friend){
    return array.some(function(element){
      return element.id === friend.id;
    })
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
