
phisancaApp.controller('LoginCtrl', function ($scope) {

  $scope.noUsername = false;
  $scope.noPwd = false;

  $scope.login = function (u, pwd) {
		if (u === undefined) {
      alert("Enter username");
      $scope.noUsername = true;
    } else if (pwd === undefined) {
      alert("Enter password");
    }
	};

});
