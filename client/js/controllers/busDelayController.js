'use strict';
var transit_realtime;
var currentTrips;
var getRouteId;
var getStopId;
var getTripId;
var getTripIdSB;
var getStopId;
var service_id;
var tripId = [];
var arrivalTime = [];
var arrivalTimeTest = {};
var stop_ids;
var routeIdList = {};
var stopIdList = {};
var stopidTripidObject = {};
var myTime = 1000;

protobuf.load("/js/controllers/gtfs-realtime.proto", function(err, root){
  transit_realtime = root.nested.transit_realtime;
});

textMessageApp.controller('BusDelayController', [ '$scope', 'Account', '$http', '_', 'moment', '$log', '$interval', '$routeParams', 'Route', '$location' ,function($scope, Account, $http, _, moment, $log, $interval, $routeParams, Route, $location) {
  // $routeParams.userId == Account.getCurrentId() ? $location.path('/account/' +Account.getCurrentId()) : $location.path('/account/' +Account.getCurrentId());
  let currentCommute = _.last($location.path().split('/'))
  Route.find({
    filter: {
      where: {
        id: currentCommute
      }
    }
  },
  function(response) {
    $scope.myCommute = response[0];
    // console.log($scope.myCommute);

  $http.get("http://gtfs.bigbluebus.com/parsed/routes.json").then(function(response) {
    let keys = Object.keys(response.data);
    function routeId(id) {
      return response.data[id].route_short_name === $scope.myCommute.route.split(" ")[0];
    }
    var currentRoutes = keys.filter(routeId).map( (id) => { return response.data[id].route_id });

    $http.get("http://gtfs.bigbluebus.com/parsed/calendar.json").then(function(response) {
      let keys = Object.keys(response.data);
      function serviceId(id) {
        return response.data[id][moment().format('dddd').toLowerCase()] == 1;
      }
      var serviceIds = keys.filter(serviceId).map( (id) => { return response.data[id].service_id });

    $http.get("http://gtfs.bigbluebus.com/parsed/trips.json").then(function(response) {
      let keys = Object.keys(response.data);
      let tripIds = [];
      var combos = combinations(currentRoutes.length, serviceIds.length);

      for (let i=0; i<combos.length; i++) {
        tripIds.push(_.where(response.data, {trip_headsign: $scope.myCommute.direction, route_id: currentRoutes[combos[i][0]], service_id: serviceIds[combos[i][1]] }));
      }
      tripIds = _.flatten(tripIds);
      let trip_keys = Object.keys(tripIds);
      tripIds = trip_keys.map((id) => { return tripIds[id].trip_id });

          $http.get("http://gtfs.bigbluebus.com/parsed/stop_times.json").then(function(response) {
            // Get stop time json
            // let keys = response.data[getTripIdNB[0]];

            for(var i=0; i<tripIds.length; i++) {
              for(var l=1; l<_.keys(response.data[tripIds[i]]).length; l++) {
                  if (
                      (response.data[tripIds[i]][l].arrival_time.split(':')[0] - moment().format('HH') == 0 ||
                      response.data[tripIds[i]][l].arrival_time.split(':')[0] - moment().format('HH') == 1)) {
                      return arrivalTime.push(tripIds[i]);
                  };
              }
            }
            $log.info(arrivalTime);

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
                  $scope.delay = arrivalTime[yourBus].split(":")[1] - moment().format('mm') + delayTime/60;
                  console.log(arrivalTime[yourBus].split(":")[1] - moment().format('mm') + delayTime/60)
                // }, 5000)
            })
          })
      })
    })
  },
  function (response) {
    console.log("Routes.json is fuuuuucked");
  })
},
function(errorResponse) {
  console.log(errorResponse);
})
}]);

function combinations(length1, length2) {
  var sub_array = []
  var array1 = []
  var array2 = []

  for (let i=0; i<length1; i++) {
    array1.push(i);
  }
  for (let i=0; i<length1; i++) {
    array2.push(i);
  }

  for (let i=0; i<length2; i++) {
    for (let j=0; j<length1; j++) {
      sub_array.push([array1[i], array2[j]]);
    }
  }
  return sub_array;
}
// NEXT TASKS
// - FIX LOGIN (DONE)
// - STREAM JSON OBJECTS WITH OBOE
// - USER PROFILE UI
// - SAVE USER PREFERENCES AND DISPLAY DELAY TIME ON DASHBOARD
// - HEROKU OR AWS DEPLOYMENT
