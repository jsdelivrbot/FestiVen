angular.module('starter')

.directive('friendAddButton', function() {
    return {
        restrict: 'AEC',
        templateUrl: '/templates/add-friend-btn.html',
        controller: function($scope, $element, $rootScope, $http) {
          $scope.addFriend = function(id){
            console.log(id);
            console.log($rootScope.id);
            $http.post('http://188.166.58.138:3000/api/addrequest',
            {
              origin: $rootScope.id,
              to: id
            })
            .success(function(){
              // Success message
              $element.html('Added');
            })
            .error(function(error){
              // Keep the dom as it is
              // Error message
            });

          }
        }
    };
});
