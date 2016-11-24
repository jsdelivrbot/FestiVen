angular.module('starter.controllers')
.controller('AddFriendsCtrl', function(ngFB, $rootScope, $http, $document) {
  var vm = this;

  vm.fbFriends = [];
  vm.added = false;

  var getFbFriends = function() {
    // Ask the database for the user's friends
    ngFB.api({
      path: '/me/friends'
    })
    .then(function(friends) {
      // Add the user's friends to the viewmodel
      vm.fbFriends = friends.data;
    });
  }

  getFbFriends();

  vm.addFriend = function(id){
    console.log("Adding friend");
    // Add the request to the list of sent and received requests
    // $http.post('http://localhost:3000/api/add-request', {origin: $rootScope.id, to: id})
    // .then(function(result){
    //   // Success message
    //   vm.added = true;
    // }, function(error){
    //   // Change dom back to button
    //   vm.added = false;
    //
    // });


    // Change the dom INSTANTLY from button to text, so that the user cannot send multiple requests



  }

  var getElement = function(id){
    var htmlID = 'button-box' + id;

    var el = $document[0].getElementById(htmlID);


    return angular.element(el);
  }

  var emptyParent = function(angularElement){
    angularElement.empty();
  }


})
