var textMessageApp = angular.module('app', [ 'ui.router', 'lbServices']);

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
    templateUrl: 'views/login.html'
  }
  $stateProvider.state(loginState);

  var signUpState = {
    name: 'signUp',
    url: '/signUp',
    templateUrl: 'views/signUp.html'
  }
  $stateProvider.state(signUpState);
});
