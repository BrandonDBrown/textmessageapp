'use strict';

angular.module('app')

.controller('HomeController', [ '$scope', function($scope) {
    $scope.greeting = 'hello';

    $scope.toggleGreeting = function() {
      $scope.greeting = ($scope.greeting == 'hello') ? 'whats up' : 'hello'
    }
  }]);
