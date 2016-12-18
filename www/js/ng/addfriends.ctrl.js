angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $q, $window, $state, $timeout, UserService, toasty) {
  var vm = this;
  vm.filteredFriends = [];
  vm.nonFbFriends = [];

  var requests = [];
  var fbFriends = [];
  var received = [];
  var friends = [];

  var searchTimeout;
  vm.getPeopleByQuery = function(text){
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function(){
      // Send request to the server to get people that match this
      UserService.getPeopleByQuery(text).then(function(result){
        // Set the array of friends to the scope
        var myId =  $window.localStorage.getItem('id');
        vm.nonFbFriends = result.data.filter(function(person){
          return (!containsFriend(vm.filteredFriends.concat(received, requests, friends), person)  && person.id !== myId);
        })

      }, function(error){
        // Just don't do anything. Don't apply the filtering.

      })
    }, 500);
  }


  // Helper function that checks if the array contains a friend object with an id of the facebook friend
  var containsFriend = function(array, friend){
    return array.some(function(element){
      return (element.id === friend.id);
    })
  }

  var pollFbFriends = function(){
    // Check localStorage for an id
    var myId = $window.localStorage.getItem('id');
    // For the id in localStorage, get the friends,  sent friend requests and received friend requests

    $q.all([
      $http.get('http://188.166.58.138:8080/api/users/' + myId + '/sent'),
      ngFB.api({path: '/me/friends'}),
      $http.get('http://188.166.58.138:8080/api/users/' + myId + '/received'),
      $http.get('http://188.166.58.138:8080/api/users/' + myId + '/friends')
    ]).then(function(data){
      requests = data[0].data;
      fbFriends = data[1].data;
      received = data[2].data;
      friends = data[3].data;



      // Filter out the facebook friends that either
      //    1. You sent a request to already
      //    2. You received a request from already
      //    3. Are already you friends
      // These arrays are concatenated together first

      vm.filteredFriends = fbFriends.filter(function(friend){
        return !(containsFriend(friends.concat(received, requests), friend));
      })
      // Only keep polling when no errors
      $timeout(pollFbFriends, 2000);
    }, function(error){
      toasty.error({
            msg: 'There was a problem fetching possible friends.',
            showClose: true,
            clickToClose: true,
            timeout: 5000,
            sound: false,
            html: true,
            shake: false,
            theme: "material"
        });
    })
  }
  pollFbFriends();


  vm.goBack = function(){
    $state.go('tab.friends');
  }

  // Change the dom INSTANTLY from button to text, so that the user cannot send multiple requests

})
