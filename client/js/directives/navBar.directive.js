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
        scope.icon = attrs.icon,
        scope.show = attrs.show,
        function() {
          if (this.loggedIn === true) {
            console.log('is this working');
          } else {
            console.log('no');
          }
        }

      },
    }
  });
