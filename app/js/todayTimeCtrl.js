
phisancaApp.controller('TodayTimeCtrl', function ($scope, Weather) {

  $scope.locationName = Weather.getActiveAddress();
  $scope.favourites = Weather.getUserFavouriteLocations();
  $scope.weather = Weather.getActiveWeatherData();

  //Used for button to stats, might be moved to other ctrl
  $scope.link = "stats";

  $scope.times = Weather.getHourlyTimes();
  $scope.labels = Array.apply(null, Array($scope.times.length)).map(String.prototype.valueOf,"");
  $scope.dates = Array.apply(null, Array($scope.times.length)).map(String.prototype.valueOf,"");
  $scope.bar = Array.apply(null, Array($scope.times.length)).map(Number.prototype.valueOf,0);
  $scope.temps = [Weather.getHourlyTemps(), $scope.bar];
  $scope.feels = Weather.getHourlyFeels();

  $scope.getLocationName = function() {
    return Weather.getActiveAddress();
  }

  $scope.toggleFavourite = function(address){
    Weather.toggleFavouriteLocation(address);
  }

  $scope.isFavourite = function(){
    if(!$scope.favourites.includes($scope.getLocationName())){
      return "";
    }else{
      return "favouritesTable";
    }
  }

  $scope.$watch('getLocationName()', function() {
    $scope.weather = Weather.getActiveWeatherData();
    $scope.updateWeather();
    $scope.setBar($scope.slider.value);
    $scope.initializeLabels();
  });

  $scope.updateWeather = function() {
    $scope.temps[0] = Weather.getHourlyTemps();
    $scope.labels = Weather.getHourlyTimes();
    $scope.dates = Weather.getHourlyDates();
    $scope.feels = Weather.getHourlyFeels();
  }

  $scope.slider = {
    value: Weather.getCurrentTimeIndex(),
    options: {
      floor: 0,
      ceil: 24,
      translate: function (value) {
                return value + ":00";
      },
      onChange: function(sliderId, modelValue, highValue, pointerType) {
        $scope.setBar(modelValue);
        Weather.setCurrentTimeIndex(modelValue);
      },
      hideLimitLabels: true
    }
  };

  // Sets the "current time" bar in the chart
  $scope.setBar = function(value) {
    $scope.temps[1] = Array.apply(null, Array($scope.times.length)).map(Number.prototype.valueOf,0);
    $scope.temps[1][value] = $scope.temps[0][value];
  }

  $scope.formatHour = function(hour) {
    var formattedHour = hour;
    if (formattedHour < 10) {
      formattedHour = "0" + hour;
    }
    formattedHour = formattedHour + ":00";
    return formattedHour;
  }

  $scope.getHourIndex = function(hour) {
    hour = $scope.formatHour(hour);
    for (var i = 0; i < $scope.times.length; i++) {
      if (hour === $scope.times[i]) {
        return i;
      }
    }
    return 0;
  }

  $scope.initializeLabels = function() {
    $scope.labels.fill("");
    for (var i = 1; i < $scope.labels.length - 1; i++) {
      if (parseInt($scope.times[i].substr(0,2)) % 6 === 0) {
        $scope.labels[i] = $scope.times[i];
      }
    }
    $scope.labels[0] = $scope.times[0];
    $scope.labels[$scope.labels.length-1] = $scope.times[$scope.labels.length-1];
  }


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

  $scope.initializeLabels();
  $scope.setBar($scope.slider.value);

});
