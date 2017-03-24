
phisancaApp.controller('LoginCtrl', function ($scope) {

  $scope.usernamePlaceholder = "username";
  $scope.pwdPlaceholder = "password";

  $scope.username = "";
  $scope.pwd = "";

  $scope.noUsername = false;        //An empty username was sent
  $scope.noPwd = false;             //An empty pwd was sent

  $scope.login = function (u, pwd) {
		if (u === "") {
      $scope.usernamePlaceholder = "Enter a username";
      $scope.noUsername = true;
    } else if (pwd === "") {
      $scope.pwdPlaceholder = "Enter a password";
      $scope.noPwd = true;
    } else {
      //Log in
    }
	};

  $scope.usernameChanged = function() {
    $scope.noUsername = false;
  }

  $scope.pwdChanged = function() {
    $scope.noPwd = false;
  }

});
