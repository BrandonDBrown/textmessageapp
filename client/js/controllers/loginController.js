'use strict';

// login
angular.module('app')
.controller('LoginController', [ '$scope', 'Account', '$location', function($scope, Account, $location) {
  $scope.loginUser = function() {
    $scope.loginResult = Account.login({email: $scope.email, password: $scope.password},
      function(res) {
        $location.path('/account/' + res.user.id);
      },
      function(res) {
        $scope.error = res.data.error.message;
        console.log(res);
      }
  )
  }
}]);
