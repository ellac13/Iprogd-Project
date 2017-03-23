
phisancaApp.controller('TodayTimeCtrl', function ($scope) {

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
