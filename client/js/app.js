var textMessageApp = angular.module('app', [ 'ui.router', 'lbServices', 'underscore', 'angularMoment']);

textMessageApp.config(function($stateProvider) {
  var homeState =  {
    name: 'home',
    url: '',
    templateUrl: 'views/home.html',
    controller: 'HomeController'
  }
  $stateProvider.state(homeState);

  var loginState = {
    name: 'login',
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  }
  $stateProvider.state(loginState);

  var logoutState = {
    name: 'logout',
    url: '/logout',
    templateUrl: 'views/logout.html',
    controller: 'LogoutController'
  }
  $stateProvider.state(logoutState);

  var signUpState = {
    name: 'signUp',
    url: '/signup',
    templateUrl: 'views/signUp.html',
    controller: 'SignUpController'
  }
  $stateProvider.state(signUpState);

  var accountProfileState = {
    name: 'accountProfile',
    url: '/account/{accountId}',
    templateUrl: 'views/accountProfile.html',
    controller: 'AccountProfileController'
  }
  $stateProvider.state(accountProfileState);
});
