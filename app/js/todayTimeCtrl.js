
phisancaApp.controller('TodayTimeCtrl', function ($scope, Weather, $interval, $location) {

  $scope.favourites = Weather.getUserFavouriteLocations();
  $scope.user = Weather.getUser();
  $scope.feelsMod = Weather.getUserFeelsMod();

  $scope.status = Weather.getLoadingWeatherMessage();
  $scope.showWeather = false;

  $scope.times = Weather.getHourlyTimes();
  $scope.labels = Weather.getHourlyTimes().slice();
  $scope.dates = Weather.getHourlyDates();
  $scope.weekdays = Weather.getHourlyWeekDays();
  $scope.bar = Array.apply(null, Array($scope.times.length)).map(Number.prototype.valueOf,0);
  $scope.temps = [Weather.getHourlyTemps(), $scope.bar];
  $scope.feels = Weather.getHourlyFeels();
  $scope.iconLoaded = false;
  $scope.icons = Weather.getHourlyIcons();

  $scope.days = Weather.getDailyDate();
  $scope.dailyTemps = Weather.getDailyTemp();
  $scope.dailyWeather = Weather.getDailyWeather();

  $scope.loadingWeatherMessage = function(){
      $scope.status = Weather.getLoadingWeatherMessage();
      if($scope.status == ""){
          $scope.showWeather = true;
      } else {
          $scope.showWeather = false;
      }
      return $scope.status;
  }

  $scope.getLocationName = function() {
    return Weather.getActiveAddress();
  }

  $scope.tooltiptext = function() {
    if ($scope.isLoggedIn()) {
      return "Modify what the temperature actually feels like"
    } else {
      return "When logged in, you can modify what the temperature feels like"
    }
  };

  $scope.getCurrentIcon = function(){
    var icon = Weather.getHourlyIcons()[Weather.getCurrentTimeIndex()];
    if(icon.length < 1){
      $scope.iconLoaded = false;
      return "";
    }
    $scope.iconLoaded = true;
    //return "images/weatherIcons/" + icon + "-big.png";
    return "images/weatherIcons/" + icon + ".svg";
  }

  $scope.getIconsHourly = function(currentTimeIndex){
	var icon = Weather.getHourlyIcons()[currentTimeIndex];
    if(icon.length < 1){
      $scope.iconLoaded = false;
      return "";
    }
    $scope.iconLoaded = true;
    return "images/weatherIcons/" + icon + ".svg";
  }

  $scope.getIconsDaily = function(currentTimeIndex){
	var icon = Weather.getDailyWeather()[currentTimeIndex];
    if(icon.length < 1){
      $scope.iconLoaded = false;
      return "";
    }
    $scope.iconLoaded = true;
    return "images/weatherIcons/" + icon + ".svg";
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

  $interval(function() {
    $scope.setBar($scope.slider.value);
    $scope.formatLabels();
  }, 100);

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
      hidePointerLabels: true,
      hideLimitLabels: true
    }
  };

  // Sets the "current time" bar in the chart
  $scope.setBar = function(value) {
    $scope.temps[1] = Array.apply(null, Array($scope.times.length)).map(Number.prototype.valueOf,0);
    // alert($scope.temps[0][value]);
    $scope.temps[1][value] = $scope.temps[0][value];
  }

  //Print label for 00:00, 06:00, 12:00 etc
  //Also print first and last unless already a label close by
  $scope.formatLabels = function() {
    $scope.labels = $scope.times.slice();
    var first = 0;
    var last = 0;
    for (var i = 0; i < $scope.labels.length; i++) {
      if (parseInt($scope.labels[i].substr(0,2)) % 6 !== 0) {
        $scope.labels[i] = "";
      } else if (first === 0) {
        first = i;
      } else {
        last = i;
      }
    }
    if (first > 2) {
      $scope.labels[0] = $scope.times[0];
    }
    if (last < $scope.labels.length - 3) {
      $scope.labels[$scope.labels.length-1] = $scope.times[$scope.labels.length-1];
    }
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
      borderColor: "rgb(0,0,0)",
      barThickness: 50
    }
  ];

  $scope.colors = [{
    borderColor: "rgb(0,0,0)",
    backgroundColor: "rgba(211,211,211, 0.4)"
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
          },
          scaleLabel: {
            display: true,
            labelString: "Temperature"
          }
        }
      ]
    },
    animation: false
  };

  $scope.isLoggedIn = function(){
    if (Weather.getUser()) {
      return true;
    }else{
      return false;
    }
  }

  $scope.increaseFeels = function(delta) {
    Weather.increaseUserFeelsMod(delta);
    $scope.feelsMod = Weather.getUserFeelsMod();
  }

  $scope.dropLocation = function(e, ui){
    console.log('dropLocation');
    //console.log(e);
    //console.log(ui.draggable["0"].innerText);
    var address = ui.draggable["0"].innerText;
    $location.url('/?search=' + address);
  }

  $scope.validDrop = function(e, ui){
    console.log('validating drop');
    if(ui.draggable["0"].innerText){
      console.log('valid drop');
    }else{
      console.log('invalid drop');
    }
  }

});
