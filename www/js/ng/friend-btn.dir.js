angular.module('starter')

.directive('friendAddButton', function() {
    return {
        restrict: 'AEC',
        templateUrl: '/templates/add-friend-btn.html',
        controller: function($scope, $element, $rootScope, $http, $window) {
          $scope.addFriend = function(id){
            $scope.disabled = false;
            console.log(id);
            console.log(localStorage.getItem('id'));
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
