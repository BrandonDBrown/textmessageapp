angular
  .module('app')
  .directive('navBar', function() {
    return {
      templateUrl: '../views/navBar.html',
      replace:     true,
      scope: {
      },
      link: function(scope, element, attrs) {
        scope.name = attrs.name,
        scope.href = attrs.href,
        scope.icon = attrs.icon
      }
    }
  });
