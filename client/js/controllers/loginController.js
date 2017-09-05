'use strict';

angular
  .module('app')
  .controller('LoginController', [ '$scope', 'Account', '$location', '$window', function($scope, Account, $location, $window) {
    $scope.loginUser = function() {
      Account.login({email: $scope.email, password: $scope.password},
        function(response) {
          $location.path('/account/' +response.user.id);
        },
        function(response) {
          $scope.error = response.data.error.message;
          console.log(response);
        }
      )
    }
  }]);

// Other possible features:
// know when you got on and tells you how far to your destination
// other people can see that you got on and approx time till you get home
