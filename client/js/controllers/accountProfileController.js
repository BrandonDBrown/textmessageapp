'use strict';

textMessageApp.controller('AccountProfileController', [ '$scope', 'Account', 'Route', '$http', '_', 'moment', '$log', function($scope, Account, Route, $http, _, moment, $log) {
  $scope.currentUser = Account.getCurrentId();
  $scope.currentRoute = 0
  $scope.routes = [];
  // $scope.selectedRoute.split(" ")[0]
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

// NEXT TASKS
// - FIX LOGIN (DONE)
// - STREAM JSON OBJECTS WITH OBOE
// - USER PROFILE UI
// - SAVE USER PREFERENCES AND DISPLAY DELAY TIME ON DASHBOARD
// - HEROKU OR AWS DEPLOYMENT
