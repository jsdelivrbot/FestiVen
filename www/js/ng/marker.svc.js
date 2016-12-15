angular.module('starter.services')
.service('MarkerService', function($q, $http, $window) {

  var add = null;
  var get = null;
  var del = null;

  this.addMarker = function(coords, peopleArray, markerType, description){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:8080/api/users/' + myId + '/markers', {
      people: peopleArray,
      location: coords,
      markerType: markerType,
      description: description
    }).then(function(result) {
      add = result;
      deferred.resolve(add);
    }, function(error) {
      // Popup with error message
      // Show the login screen
      add = error;
      deferred.reject(error);
    })

    add = deferred.promise;
    return $q.when(add);
  }

  this.getMarkers = function(){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.get('http://188.166.58.138:8080/api/users/' + myId + '/markers')
    .then(function(result){
      get = result;
      deferred.resolve(get);
    }, function(error){
      get = error;
      deferred.reject(error);
    })

    get = deferred.promise;
    return $q.when(get);
  }

  this.deleteMarker = function(id){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();


    $http.delete('http://188.166.58.138:8080/api/users/' + myId + '/markers/' + id)
    .then(function(result){
      del = result;
      deferred.resolve(del);
    }, function(error){
      del = error;
      deferred.reject(error);
    })

    del = deferred.promise;
    return $q.when(del);
  }
});
