angular.module('starter')

.directive('friendButton', function() {
    return {
        restrict: 'AEC',
        templateUrl: function(elem, attr) {
          return '/templates/' + attr.type +  '-friend-btn.html';
        },
        controller: function($scope, $element, $rootScope, $http, $window) {
          $scope.addFriend = function(id){
            $scope.disabled = false;

            $http.post('http://188.166.58.138:3000/api/addrequest',
            {
              origin: $window.localStorage.getItem('id'),
              to: id
            })
            .success(function(){
              // Success message
              $element.html('Added');
              $scope.disabled = true;
            })
            .error(function(error){
              // Keep the dom as it is
              // Error message
            });

          }
        }
    };
});
