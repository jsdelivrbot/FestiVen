angular.module('starter.services')

.service('UserService', function($q, $http, $window, ngFB) {

  var info = undefined;
  var friends = undefined;
  var sent = undefined;
  var received = undefined;

  this.getFriends = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/user/friends',
      {
        id: myId
      }).then(function(result) {
      friends = result;
      deferred.resolve(friends);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      friends = error;
      deferred.reject(error);
    })

    friends = deferred.promise;

    return $q.when(friends);
  }

  this.getReceived = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/user/received',
      {
        id: myId
      }).then(function(result) {
      received = result;
      deferred.resolve(received);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      received = error;
      deferred.reject(error);
    })

    received = deferred.promise;

    return $q.when(received);

  }

  this.getSent = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:3000/api/user/sent',
      {
        id: myId
      }).then(function(result) {
      sent = result;
      deferred.resolve(sent);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      sent = error;
      deferred.reject(error);
    })

    sent = deferred.promise;

    return $q.when(sent);

  }

  this.getInfo = function(){
    var deferred = $q.defer();
    ngFB.api({
      path: '/me',
      params: {
        fields: 'id, name'
      }
    }).then(function(data){
      info = data;
      deferred.resolve(info);
      //Set the user's id and name to the local storage
      $window.localStorage.setItem('createdAt', (new Date()).getTime());
      $window.localStorage.setItem('name', data.name);
      $window.localStorage.setItem('id', data.id);
    }, function(error){
      info = error;
      deferred.reject(error);
    })

    info = deferred.promise;

    return $q.when(info);
  }

});
