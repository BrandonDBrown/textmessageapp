'use strict';

angular
  .module('app')
  .controller('AccountProfileController', [ '$scope', 'Account', 'Route', '$http', '_', 'moment', '$log', '$routeParams', '$location', function($scope, Account, Route, $http, _, moment, $log, $routeParams, $location) {
    $routeParams.userId == Account.getCurrentId() ? $location.path('/account/' +Account.getCurrentId()) : $location.path('/account/' +Account.getCurrentId());
    $scope.currentUser = Account.getCurrentId();
    $scope.currentRoute = 0
    $scope.routes = [];
    Route.find({
      filter: {
        where: {
          accountId: Account.getCurrentId()
        }
      }
    },
    function(response) {
      for(let i=0; i<response.length; i++) {
        $scope.routes.push(response[i].id);
      }
    },
    function(errorResponse) {
      console.log(errorResponse);
    })
  }]);
