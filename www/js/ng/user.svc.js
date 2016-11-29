angular.module('starter.services')

.service('UserService', function($q, $http, $window, ngFB) {

  var info = undefined;
  var friends = undefined;

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
