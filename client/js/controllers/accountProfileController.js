'use strict';

angular
  .module('app')
  .controller('AccountProfileController', [ '$scope', 'Account', 'Route', '$http', '_', 'moment', '$log', '$routeParams', '$location', function($scope, Account, Route, $http, _, moment, $log, $routeParams, $location) {
    $routeParams.userId == Account.getCurrentId() ? $location.path('/account/' +Account.getCurrentId()) : $location.path('/account/' +Account.getCurrentId());
    $scope.currentUser = Account.getCurrentId();
    var newRoute = {};
    var routeList = [];
    $scope.routes = [];
    Route.find({
      filter: {
        where: {
          accountId: Account.getCurrentId()
        }
      }
    },
    function(response) {
      console.log(response)
      async function pleaseWork(response) {
        response.forEach(function(item){
          newRoute.id = item.id;
          // newRoute.number = item.length;
          console.log(newRoute);
          await routeList.push(newRoute);
          console.log(routeList);
        })
      }

      // for(let i=0; i<response.length; i++) {
      //   newRoute.id = response[i].id;
      //   newRoute.number = i+1;
      //   console.log(newRoute);
      //   routeList[i] = newRoute;
      //   console.log(routeList);
      // }
    },
    function(errorResponse) {
      console.log(errorResponse);
    })
  }]);
