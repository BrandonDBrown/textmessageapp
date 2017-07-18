'use strict';

angular.module('app')

.controller('HomeController', [ '$scope', 'Account', function($scope, Account) {
    $scope.greeting = 'hello';

    $scope.toggleGreeting = function() {
      $scope.greeting = ($scope.greeting == 'hello') ? 'whats up' : 'hello'
    }

    $scope.accounts = Account.findById({
        id: 1
    });
}]);
