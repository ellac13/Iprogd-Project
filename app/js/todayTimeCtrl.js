
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

  $scope.labels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00",
    "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
  $scope.series = ['Series A'];
  $scope.data = [
    [3, 2, 3, 3, 4, 4, 6, 6, 7, 9, 11, 13, 13, 14, 13, 14, 14, 14, 13, 13, 9, 8, 6, 4]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

});
