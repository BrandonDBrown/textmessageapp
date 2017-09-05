angular
  .module('app', ['lbServices', 'underscore', 'angularMoment', 'ngRoute', 'ngAnimate'])

  .config(function($routeProvider) {

    $routeProvider

    .when ("/", {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })

    .when("/login", {
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })

    .when("/signup", {
      templateUrl: 'views/signUp.html',
      controller: 'SignUpController'
    })

    .when("/account/:userId", {
      templateUrl: 'views/accountProfile.html',
      controller: 'AccountProfileController'
    })

    .when("/account/:userId/add", {
      templateUrl: 'views/addRoute.html',
      controller: 'AddRouteController'
    })

    .when("/account/:userId/route/:id", {
      templateUrl: 'views/delay.html',
      controller: 'BusDelayController'
    })
  })

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', '../css/particles.json', function() {
  console.log('callback - particles.js config loaded');
});
