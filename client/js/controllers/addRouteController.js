'use strict';
var transit_realtime;
var currentTrips;
var getRouteId;
var getStopId;
var getTripIdNB;
var getTripIdSB;
var getStopId;
var service_id;
var tripId = [];
var arrivalTime = {};
var arrivalTimeTest = {};
var stop_ids;
var routeIdList = {};
var stopIdList = {};
var stopidTripidObject = {};
var myTime = 1000;

angular
  .module('app')
  .controller('AddRouteController', [ '$scope', 'Account', '$http', '_', 'moment', '$routeParams', '$location', 'Route', function($scope, Account, $http, _, moment, $routeParams, $location, Route) {
  $routeParams.userId === Account.getCurrentId() ? $location.path('/account/' +Account.getCurrentId()+ '/add') : $location.path('/account/' +Account.getCurrentId()+ '/add');
  $scope.currentUser = Account.getCurrentId();
  $scope.error = "";

  $scope.addRoute = function() {
    Route.findOne({
      filter: {
        where: {
          route: $scope.selectedRoute,
          stop: $scope.selectedStop,
          direction: $scope.selectedDirection,
          accountId: Account.getCurrentId()
        }
      }
    },
    function(list) {
      console.log(list);
      $scope.error = "Route already exists. Please choose a new route."
    },
    function(errorResponse) {
      console.log(errorResponse);
      $http.post('/api/Routes', { "route": $scope.selectedRoute, "stop": $scope.selectedStop, "direction": $scope.selectedDirection, "accountId": Account.getCurrentId() }).then(function(response) {
        console.log(response);
        $location.path('/account/' +$scope.currentUser);
      },
      function(response) {
        console.log(response);
      })
    })
  }

  $http.get("http://gtfs.bigbluebus.com/parsed/routes.json").then(function(response) {
    let count = 0
    let data = Object.keys(response.data);
    let route_name = data.map(function(id) { return response.data[id].route_short_name+ " " +response.data[id].route_long_name });
    route_name = _.uniq(route_name)
    $scope.routes = route_name;
    $scope.selectedDirection = "";
    $scope.selectedStop = "";

    // Set initial route selection
    $scope.selectedRoute = route_name[0];
    data.map(function(id) { return routeIdList[response.data[id].route_short_name] = response.data[id].route_id });
    },
    function (response) {
      alert("Your route can't be retrieved at this time. Please try again.");
    });

  $http.get("http://gtfs.bigbluebus.com/parsed/trips.json").then(function(response) {
    let data = Object.keys(response.data);
    let direction = [];
    getRouteId = routeIdList[$scope.selectedRoute.split(" ")[0]];
    function tripFilterNB(tripId) {
      if (response.data[tripId].route_id === getRouteId && response.data[tripId].direction_id === '0') {
        return response.data[tripId];
      }
    }
    function tripFilterSB(tripId) {
      if (response.data[tripId].route_id === getRouteId && response.data[tripId].direction_id === '1') {
        return response.data[tripId];
      }
    }
    getTripIdNB = data.filter(tripFilterNB);
    console.log(getTripIdNB);
    getTripIdSB = data.filter(tripFilterSB);
    direction.push(response.data[getTripIdNB[0]].trip_headsign);
    direction.push(response.data[getTripIdSB[0]].trip_headsign);

    $scope.directions = direction;

    $scope.changeRoute = function() {
      $scope.error = "";
      direction = [];
      getRouteId = routeIdList[$scope.selectedRoute.split(" ")[0]];
      getTripIdNB = data.filter(tripFilterNB);
      getTripIdSB = data.filter(tripFilterSB);
      direction.push(response.data[getTripIdNB[0]].trip_headsign);
      direction.push(response.data[getTripIdSB[0]].trip_headsign);
      $scope.directions = direction;
    };
  },
  function (response) {
    console.log("Routes.json is fuuuuucked");
  });

  $scope.changeDirection = function() {
    $scope.error = "";
    $http.get("http://gtfs.bigbluebus.com/parsed/stop_times.json").then(function(response) {
      if ($scope.directions[0] === $scope.selectedDirection) {
        // Take the trip id with the most stops
        var data = Object.keys(response.data[getTripIdNB[0]]);
        stop_ids = data.map(function(id) { return response.data[getTripIdNB[0]][id].stop_id });
      } else {
        // Take the trip id with the most stops
        var data = Object.keys(response.data[getTripIdSB[0]]);
        stop_ids = data.map(function(id) { return response.data[getTripIdSB[0]][id].stop_id });
      }
      $http.get("http://gtfs.bigbluebus.com/parsed/stops.json").then(function(response) {
        let stopDropdown = [];
        stop_ids.map(function(id) { return stopIdList[response.data[id].stop_name] = response.data[id].stop_id });
        for (let i=0; i<stop_ids.length; i++) {
          stopDropdown.push(response.data[stop_ids[i]].stop_name);
        }
        stopDropdown = _.uniq(stopDropdown);
        $scope.stops = stopDropdown;
      },
      function (response) {
        console.log("Routes.json is fuuuuucked");
      });
    },
    function (response) {
      console.log("Routes.json is fuuuuucked");
    });
  };

  $scope.changeStop = function() {
    $scope.error = "";
  }

}]);
