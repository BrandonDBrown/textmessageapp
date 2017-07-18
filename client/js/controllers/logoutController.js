//...
//log a user out
'use strict';

// login
angular.module('app')
.controller('LogoutController', [ '$scope', 'Account', '$location', function($scope, Account, $location) {
  $scope.logoutUser = function() {
    Account.logout('asd0a9f8dsj9s0s3223mk', function (err) {
      console.log(err || 'Logged out');
    });
    Account.logout(req.accessToken.id, function(err) {

  }
  if (!req.accessToken) return res.sendStatus(401); //return 401:unauthorized if accessToken is not present
    if (err) return next(err);
    res.redirect('/'); //on successful logout, redirect
  });
});
//...

User.logout('asd0a9f8dsj9s0s3223mk', function (err) {
  console.log(err || 'Logged out');
});
