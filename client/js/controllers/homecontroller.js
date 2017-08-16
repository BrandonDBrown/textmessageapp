'use strict';



textMessageApp.controller('HomeController', [ '$scope', 'Account', '$http', function($scope, Account, $http) {
    $scope.loggedIn = Account.getCurrentId();

    $scope.accounts = Account.findById({
        id: 1
    });
}]);
