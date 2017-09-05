'use strict';

// access User model
angular
  .module('app')
  .controller('SignUpController', [ '$scope', 'Account', function($scope, Account) {
    $scope.signUpUser = function() {
      $scope.signUpResult = Account.create({email: $scope.email, password: $scope.password}, Account,
        function(err, token) {
          if (err) {
            $scope.error = "Not a valid email or password."
          } else {
            $scope.token = token.id;
          }
      })
    }
  }]);
