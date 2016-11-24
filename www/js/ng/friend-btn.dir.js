angular.module('starter')

.directive('friendAddButton', function() {
    return {
        restrict: 'AEC',
        templateUrl: '/templates/add-friend-btn.html',
        controller: function($scope, $element) {
          $scope.addFriend = function(id){
            $element.html('Added');
          }
        }
    };
});
