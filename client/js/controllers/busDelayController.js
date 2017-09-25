'use strict';
var transit_realtime;

protobuf.load("/js/controllers/gtfs-realtime.proto", function(err, root){
  transit_realtime = root.nested.transit_realtime;
});

angular
  .module('app')
  .controller('BusDelayController', [ '$scope', 'Account', '$http', '_', 'moment', '$interval', '$routeParams', 'Route', '$location', '$timeout', function($scope, Account, $http, _, moment, $interval, $routeParams, Route, $location, $timeout) {
  let currentCommute = _.last($location.path().split('/'))
  $routeParams.userId == Account.getCurrentId() ? $location.path('/account/' +Account.getCurrentId()+ '/route/' +currentCommute ) : $location.path('/account/' +Account.getCurrentId());
  // Route.exists( {id: $routeParams.id}) ? $location.path('/account/' +Account.getCurrentId()+ '/route/' +currentCommute ) : $location.path('/account/' +Account.getCurrentId());
  $scope.dataLoaded = false;
  Route.find({
    filter: {
      where: {
        id: currentCommute
      }
    }
  },
  function(response) {
    $scope.myCommute = response[0];
    $scope.direction = $scope.myCommute.direction;
    $scope.route = $scope.myCommute.route;
    $scope.stop = $scope.myCommute.stop;

    var arrivalTime = {};
    var currentArrivalTimes = {};
    var delayCheck;


    delay();

    $timeout(function() {
      delayCheck = $interval(delay, 20000);
    }, 0)

    function delay() {
    $http.get("http://gtfs.bigbluebus.com/parsed/routes.json").then(function(response) {
      let routekeys = Object.keys(response.data);
      function routeId(id) {
        return response.data[id].route_short_name === $scope.myCommute.route.split(" ")[0];
      }
      var currentRoutes = routekeys.filter(routeId).map( (id) => { return response.data[id].route_id });
      console.log(currentRoutes);
      $http.get("http://gtfs.bigbluebus.com/parsed/calendar.json").then(function(response) {
        let calendarkeys = Object.keys(response.data);
        function serviceId(id) {
          return response.data[id][moment().format('dddd').toLowerCase()] == 1;
        }
        var serviceIds = calendarkeys.filter(serviceId).map( (id) => { return response.data[id].service_id });

        $http.get("http://gtfs.bigbluebus.com/parsed/trips.json").then(function(response) {
          // let keys = Object.keys(response.data);
          let tripIds = [];
          var combos = combinations(currentRoutes.length, serviceIds.length);
          for (let i=0; i<combos.length; i++) {
            // tripIds.push(_.where(response.data, {trip_headsign: $scope.myCommute.direction, route_id: currentRoutes[combos[i][0]]}));
            tripIds.push(_.where(response.data, {trip_headsign: $scope.myCommute.direction, route_id: currentRoutes[combos[i][0]], service_id: serviceIds[combos[i][1]] }));
          }
          tripIds = _.flatten(tripIds);
          let trip_keys = Object.keys(tripIds);
          tripIds = trip_keys.map((id) => { return tripIds[id].trip_id });
          console.log(tripIds);

          $http.get("http://gtfs.bigbluebus.com/parsed/stops.json").then(function(response) {
            let stopId = _.findWhere(response.data, {stop_name: $scope.myCommute.stop }).stop_id;

            $http.get("http://gtfs.bigbluebus.com/parsed/stop_times.json").then(function(response) {
              for(var i=0; i<tripIds.length; i++) {
                for(var l=1; l<_.keys(response.data[tripIds[i]]).length; l++) {
                  if (
                    (response.data[tripIds[i]][l].arrival_time.split(':')[0] - moment().format('HH') == 0 ||
                     response.data[tripIds[i]][l].arrival_time.split(':')[0] - moment().format('HH') == 1 &&
                     response.data[tripIds[i]][l].arrival_time.split(':')[1] - moment().format('mm') < 0) && response.data[tripIds[i]][l].stop_id == stopId) {
                    arrivalTime[tripIds[i]] = response.data[tripIds[i]][l].arrival_time;
                  };
                }
              }
              console.log(arrivalTime);

              $http.get("http://gtfs.bigbluebus.com/tripupdates.bin", {responseType: "arraybuffer"}).then(function(response) {
                let realtime = transit_realtime.FeedMessage.decode(new Uint8Array(response.data));
                var yourBus;
                var previous = 1000000;
                let data = Object.keys(realtime.entity);
                data.map(function(id) { return currentArrivalTimes[realtime.entity[id].tripUpdate.trip.tripId] = id });
                $scope.currentTrip = _.intersection(_.keys(arrivalTime), _.keys(currentArrivalTimes));
                $scope.currentTrip.forEach(function(id) {
                  if(arrivalTime[id].split(":").join("") > moment().format('HH:mm:ss').split(":").join("")) {
                    var current = arrivalTime[id].split(":").join("")
                    if (current < previous) {
                      yourBus = id;
                      previous = current;
                    }
                  }
                })
                console.log(yourBus);
                var nextHour = arrivalTime[yourBus].split(":")[1] - moment().format('mm') < 0 ? 60 : 0;
                if ($scope.currentTrip.length !== 0)  {
                  var delayTime = realtime.entity[currentArrivalTimes[yourBus]].tripUpdate.stopTimeUpdate["0"].arrival.delay;
                  console.log(arrivalTime[yourBus]);
                  console.log(delayTime);
                  $scope.delay = arrivalTime[yourBus].split(":")[1] - moment().format('mm') + delayTime/60 + nextHour;
                  $scope.dataLoaded = true;
                } else {
                  $scope.delay = "No Buses running at this time";
                  $scope.dataLoaded = true;
                  $scope.$on('$destroy',function(){
                    if(delayCheck) {
                      $interval.cancel(delayCheck);
                    }
                  });
                }
              })
            })
          })
        })
      })
  },
  function (response) {
    console.log("Error" +response);
  })
// }, intervalTimeout)
$scope.$on('$destroy',function(){
  if(delayCheck) {
    $interval.cancel(delayCheck);
  }
});
}
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
