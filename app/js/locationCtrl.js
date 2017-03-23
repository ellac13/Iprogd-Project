
phisancaApp.controller('LocationCtrl', function ($scope,Weather) {

  $scope.testGeo = function() {
    Weather.testGeolocation();
  }


});