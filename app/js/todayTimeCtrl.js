
phisancaApp.controller('TodayTimeCtrl', function ($scope, Weather) {

  $scope.locationName = Weather.getActiveAddress();

  $scope.getLocationName = function() {
    return Weather.getActiveAddress();
  }

  //Used for button to stats, might be moved to other ctrl
  $scope.link = "stats";
  $scope.linkName = "History";

  $scope.slider = {
    value: 15,
    options: {
      floor: 0,
      ceil: 23,
      translate: function (value) {
                return value + ":00";
            }
    }
  };

  $scope.getHourIndex = function(hour) {
    if (hour < 10) {
      hour = "0" + hour;
    }
    hour = hour + ":00";
    // alert(hour);
    for (var i = 0; i < $scope.labels.length; i++) {
      if (hour === $scope.labels[i]) {
        return i;
      }
    }
    return 0;
  }

  $scope.labels = Weather.getHourlyTimes();
  $scope.temps = [Weather.getHourlyTemps()];
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          gridLines: {
            display: false
          },
          ticks: {
            min: Math.min(0, Math.min.apply(Math, $scope.temps[0])),
            max: Math.max.apply(Math, $scope.temps[0]) + 2
          }
        }
      ]
    }
  };

});
