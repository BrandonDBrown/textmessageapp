'use strict';

textMessageApp.controller('AccountProfileController', [ '$scope', 'Account', 'Route', '$http', '_', 'moment', '$log', function($scope, Account, Route, $http, _, moment, $log) {
  $scope.currentUser = Account.getCurrentId();
  $scope.currentRoute = Route.findbyaccount
  // $scope.routeSelect = function() {
  //   $location.path('/account/' +$scope.currentUser+ '/route/' + );
  //
  // }
}]);

// NEXT TASKS
// - FIX LOGIN (DONE)
// - STREAM JSON OBJECTS WITH OBOE
// - USER PROFILE UI
// - SAVE USER PREFERENCES AND DISPLAY DELAY TIME ON DASHBOARD
// - HEROKU OR AWS DEPLOYMENT
