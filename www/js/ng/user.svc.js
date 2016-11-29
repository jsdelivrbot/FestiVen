angular.module('starter.services')

.service('UserService', function($q, $window, ngFB) {

//for the purpose of this example I will store user data on ionic local storage but you should save it on a database

  this.setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  this.getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  var info = undefined;

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
