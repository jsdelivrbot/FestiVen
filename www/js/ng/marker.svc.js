angular.module('starter.services')
.service('MarkerService', function($q, $http, $window) {

  var add = null;

  this.addMarker = function(coords, peopleArray, markerType){
    var myId = $window.localStorage.getItem('id');
    var deferred = $q.defer();

    $http.post('http://188.166.58.138:8080/api/users/' + myId + '/markers/', {
      people: peopleArray,
      location: coords
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






});
