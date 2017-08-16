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

protobuf.load("/js/controllers/gtfs-realtime.proto", function(err, root){
  transit_realtime = root.nested.transit_realtime;
});

textMessageApp.controller('AccountProfileController', [ '$scope', 'Account', '$http', '_', 'moment', '$log', '$interval', '$routeParams', '$location', function($scope, Account, $http, _, moment, $log, $interval, $routeParams, $location) {
  $routeParams.userId == Account.getCurrentId() ? $location.path('/account/' +Account.getCurrentId()) : $location.path('/account/' +Account.getCurrentId());
  $http.get("http://gtfs.bigbluebus.com/parsed/routes.json").then(function(response) {
    let count = 0
    let data = Object.keys(response.data);
    let route_name = data.map(function(id) { return response.data[id].route_short_name+ " " +response.data[id].route_long_name });
    route_name = _.uniq(route_name)
    $scope.routes = route_name;

    // Set initial route selection
    $scope.selectedRoute = route_name[0];

    data.map(function(id) { return routeIdList[response.data[id].route_short_name] = response.data[id].route_id });
    // var routez = _.find(data, function(id) { return response.data[id].route_short_name === $scope.selectedRoute.split(" ")[0] });
  },
  function (response) {
    console.log("Routes.json is fuuuuucked");
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
    getTripIdSB = data.filter(tripFilterSB);
    direction.push(response.data[getTripIdNB[0]].trip_headsign);
    direction.push(response.data[getTripIdSB[0]].trip_headsign);

    $scope.directions = direction;

    $scope.changeRoute = function() {
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
    // Get stop time json
    getStopId = stopIdList[$scope.selectedStop];
    $log.info(getStopId);
    // arrivalTime = [];
    $http.get("http://gtfs.bigbluebus.com/parsed/stop_times.json").then(function(response) {
      let data = response.data[getTripIdNB[0]];
      for(var i=0; i<getTripIdNB.length; i++) {
        for(var l=1; l<_.keys(response.data[getTripIdNB[i]]).length; l++) {
            if (response.data[getTripIdNB[i]][l].stop_id === getStopId &&
                (response.data[getTripIdNB[i]][l].arrival_time.split(':')[0] - moment().format('HH') == 0 ||
                response.data[getTripIdNB[i]][l].arrival_time.split(':')[0] - moment().format('HH') == 1)) {
                  arrivalTime[response.data[getTripIdNB[i]][l].trip_id] = response.data[getTripIdNB[i]][l].arrival_time
                // arrivalTime.push(response.data[getTripIdNB[i]][l].trip_id)
                  // arrivalTime = _.uniq(arrivalTime);
              // if(response.data[arrivalTime[0]].arrival_time >)
              // if (response.data[getTripIdNB[i][l]].arrival_time - moment().format('HH:mm:ss') < myTime) {
                // myTime =  arrivalTime[response.data[getTripIdNB[i][l]].arrival_time];
              // }
            };
          // }
        }
      }
      $log.info(arrivalTime);
// MAKE AN OBJECT ANALOGOUS TO ARRIVALTIME THAT HAS KEY ARRIVAL TIME VALUE TRIP ID
// THE FILTER CURRENT TRIP BY THE MIN ARRIVAL TIME
    })
    .then(function() {
    $http.get("http://gtfs.bigbluebus.com/tripupdates.bin", {responseType: "arraybuffer"}).then(function(response) {
      let realtime = transit_realtime.FeedMessage.decode(new Uint8Array(response.data));
      console.log(realtime);
      var yourBus;
      var previous = 1000000;
      let data = Object.keys(realtime.entity);
      data.map(function(id) { return arrivalTimeTest[realtime.entity[id].tripUpdate.trip.tripId] = id });
      $log.info(arrivalTimeTest);
      var currentTrip = _.intersection(_.keys(arrivalTime), _.keys(arrivalTimeTest));
      currentTrip.forEach(function(id) {
        if(arrivalTime[id].split(":").join("") > moment().format('HH:mm:ss').split(":").join("")) {
          var current = arrivalTime[id].split(":").join("")
          if (current < previous) {
            yourBus = id;
            previous = arrivalTime[id].split(":").join("")
          }
        }
      })
      console.log(yourBus);
        var delayTime = realtime.entity[arrivalTimeTest[yourBus]].tripUpdate.stopTimeUpdate["0"].arrival.delay;
        // $interval(function(){
          console.log(arrivalTime[yourBus].split(":")[1] - moment().format('mm') + delayTime/60)
        // }, 5000)
    }),
    function (response) {
      console.log("tripupdates is fuuuuucked");
    };
  });
}
}]);

// NEXT TASKS
// - FIX LOGIN (DONE)
// - STREAM JSON OBJECTS WITH OBOE
// - USER PROFILE UI
// - SAVE USER PREFERENCES AND DISPLAY DELAY TIME ON DASHBOARD
// - HEROKU OR AWS DEPLOYMENT
