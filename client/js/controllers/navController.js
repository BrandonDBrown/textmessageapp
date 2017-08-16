//...
//log a user out
'use strict';

// login
textMessageApp.controller('navController', [ '$scope', 'Account', '$http', '$location', function($scope, Account, $http, $location) {
  $scope.currentUser = Account.getCurrentId();
  $scope.loggedIn = Account.isAuthenticated();

  $scope.logoutUser = function() {
    $http.get('http://localhost:3000/api/Accounts/'+$scope.currentUser+'/accessTokens').then(function(response) {
      $scope.currentAuthToken = response.data[0].id;
    }).then(function() {
      Account.logout($scope.currentAuthToken);
      $location.path('/login');
      $scope.loggedIn = false;
    }),
    function (response) {
      console.log("authtoken is fuuuuucked"+ response);
    }
  }
}]);
