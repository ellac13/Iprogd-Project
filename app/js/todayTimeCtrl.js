
phisancaApp.controller('TodayTimeCtrl', function ($scope) {

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

});
