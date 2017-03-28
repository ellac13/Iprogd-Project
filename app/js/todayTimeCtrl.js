
phisancaApp.controller('TodayTimeCtrl', function ($scope, Weather) {

  $scope.locationName = Weather.getActiveAddress();

  $scope.getLocationName = function() {
    return Weather.getActiveAddress();
  }

  //Used for button to stats, might be moved to other ctrl
  $scope.link = "stats";
  $scope.linkName = "History";

  $scope.slider = {
    value: Weather.getCurrentTimeIndex(),
    options: {
      floor: 0,
      ceil: 23,
      translate: function (value) {
                return value + ":00";
      },
      onChange: function(sliderId, modelValue, highValue, pointerType) {
        $scope.setBar(modelValue);
      },
      hideLimitLabels: true

    }
  };

  $scope.setBar = function(value) {
    $scope.temps[1] = Array.apply(null, Array($scope.times.length)).map(Number.prototype.valueOf,0);
    $scope.temps[1][$scope.getHourIndex(value)] = $scope.temps[0][value];
  }

  $scope.getHourIndex = function(hour) {
    if (hour < 10) {
      hour = "0" + hour;
    }
    hour = hour + ":00";
    for (var i = 0; i < $scope.times.length; i++) {
      if (hour === $scope.times[i]) {
        return i;
      }
    }
    return 0;
  }

  $scope.times = Weather.getHourlyTimes();

  $scope.labels = Array.apply(null, Array($scope.times.length)).map(String.prototype.valueOf,"");
  for (var i = 0; i < $scope.labels.length; i+=6) {
    $scope.labels[i] = $scope.times[i];
  }
  $scope.labels[$scope.labels.length-1] = $scope.times[$scope.labels.length-1];

  $scope.bar = Array.apply(null, Array($scope.times.length)).map(Number.prototype.valueOf,0);
  $scope.temps = [Weather.getHourlyTemps(), $scope.bar];
  $scope.datasetOverride = [
    {
      yAxisID: 'y-axis-1',
      type: 'line'
    },
    {
      label: "Bar chart",
      borderWidth: 1,
      type: 'bar',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      barThickness: 50
    }];
  $scope.options = {
    tooltips: {
      enabled: false
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius:0
      }
    },
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
            suggestedMin: Math.min(0, Math.min.apply(Math, $scope.temps[0])),
            suggestedMax: Math.max.apply(Math, $scope.temps[0])
          }
        }
      ]
    },
    animation: false
  };

  $scope.setBar($scope.slider.value);

});
