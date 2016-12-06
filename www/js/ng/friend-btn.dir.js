angular.module('starter')
.directive('friendButton', function() {
  return {
    // replace: true,
    // Restrict this directive to either attribute or element or class name
    restrict: 'AEC',
    // templateUrl: function(elem, attr) {
    //   return '/templates/' + attr.type +  '-friend-btn.html';
    // },
    controller: function($scope, $element, $rootScope, $http, $window, UserService, socket) {
        $scope.addFriend = function(id) {
          $scope.disabled = false;
          // Send a friend request from the id in localStorage to the clicked friend's id
          $http.post('http://188.166.58.138:8080/api/users/' + $window.localStorage.getItem('id') + '/sent', {
            to: id
          })
          .success(function() {
            // Success message
            $element.html('Added');
            $scope.disabled = true;
          })
          .error(function(error) {
            // Keep the DOM as is
            // Error message
          });
      }

      $scope.deleteFriend = function(id){
        console.log('Deleting friend');
        UserService.deleteFriend(id).then(function(){
          $element.parent().html('Deleted');
        })
      }

      $scope.cancelRequest = function(id){
        console.log('Canceling request');
        UserService.cancelRequest(id).then(function(){
          $element.parent().html('Canceled');
        })
      }

      $scope.acceptRequest = function(id) {
        console.log('Accepting request');
        UserService.acceptRequest(id).then(function() {
          socket.emit('add-friend', {myId: $window.localStorage.getItem('id'), id: id});
          $element.parent().html('Accepted');
        });
      }

      $scope.declineRequest = function(id) {
        console.log('Decline request');
        UserService.declineRequest(id).then(function() {
          $element.parent().html('Declined');
        });
      }
    }
  };
});
