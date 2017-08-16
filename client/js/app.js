var textMessageApp = angular.module('app', ['lbServices', 'underscore', 'angularMoment', 'ngRoute']);

textMessageApp.config(function($routeProvider) {

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
})
// .otherwise({
//     redirectTo: '/'
// });;
