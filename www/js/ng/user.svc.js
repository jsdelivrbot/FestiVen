angular.module('starter.services')
.service('UserService', function($q, $http, $window, ngFB) {

  var info = undefined;
  var friends = undefined;
  var sent = undefined;
  var received = undefined;
  var accept = undefined;
  var decline = undefined;
  var cancel = undefined;
  var deleting = undefined;
  var query = undefined;

  this.getInfo = function() {
    var deferred = $q.defer();

    // Check for a currently logged in user
    ngFB.api({
      path: '/me',
      params: {
        fields: 'id, name'
      }
    }).then(function(data){
      info = data;
      deferred.resolve(info);
      // Save the user's id and name to localStorage
      $window.localStorage.setItem('name', data.name);
      $window.localStorage.setItem('id', data.id);
    }, function(error){
      info = error;
      deferred.reject(error);
    })

    info = deferred.promise;
    return $q.when(info);
  }

  this.acceptRequest = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:8080/api/users/' + myId + '/friends',
      {
        accept_id: id
      }).then(function(result) {
      accept = result;
      deferred.resolve(accept);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      accept = error;
      deferred.reject(error);
    })

    accept = deferred.promise;
    return $q.when(accept);
  }

  this.deleteFriend = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.delete('http://188.166.58.138:8080/api/users/' + myId + '/friends/' + id).then(function(result) {
      deleting = result;
      deferred.resolve(deleting);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      deleting = error;
      deferred.reject(error);
    })

    deleting = deferred.promise;
    return $q.when(deleting);
  }

  this.cancelRequest = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.delete('http://188.166.58.138:8080/api/users/' + myId + '/sent/' + id).then(function(result) {
      cancel = result;
      deferred.resolve(cancel);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      cancel = error;
      deferred.reject(error);
    })

    cancel = deferred.promise;
    return $q.when(cancel);
  }

  this.declineRequest = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.delete('http://188.166.58.138:8080/api/users/' + myId + '/received/' + id).then(function(result) {
      decline = result;
      deferred.resolve(decline);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      decline = error;
      deferred.reject(error);
    })

    decline = deferred.promise;
    return $q.when(decline);
  }

  this.getFriends = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.get('http://188.166.58.138:8080/api/users/' + myId + '/friends').then(function(result) {
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

    $http.get('http://188.166.58.138:8080/api/users/' + myId + '/received').then(function(result) {
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

    $http.get('http://188.166.58.138:8080/api/users/' + myId + '/sent').then(function(result) {
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

  this.getPeopleByQuery = function(text){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:8080/api/users/search', {
      search: text
    }).then(function(result) {
      query = result;
      deferred.resolve(query);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      query = error;
      deferred.reject(error);
    })

    query = deferred.promise;
    return $q.when(query);
  }
});
