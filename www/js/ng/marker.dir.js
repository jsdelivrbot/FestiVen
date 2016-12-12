angular.module('starter')
.directive('marker', function() {
        return {
          replace: true,
          restrict:'AEC',
          scope: {
            value: '=value'
          },

          link: function (scope, element, attrs) {
            var update = function(value) {
              scope.value = value;
            };

            scope.$watch("value", function(value) {
              update(value);
            });
            update(scope.value);
          },
          template: '<div><img width="32px" src="../img/icons/{{value}}_orange.svg"/></div>'
        };
    });;
