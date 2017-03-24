
phisancaApp.controller('LoginCtrl', function ($scope) {

  $scope.usernamePlaceholder = "username";
  $scope.pwdPlaceholder = "password";

  $scope.username = "";
  $scope.pwd = "";

  $scope.noUsername = false;        //An empty username was sent
  $scope.noPwd = false;             //An empty pwd was sent

  $scope.loggedIn = false;
  $scope.currentUser = "";
  $scope.users = {
    isak:"isak",
    calle:"calle",
    philip:"philip",
    andreas:"andreas"
  };

  $scope.login = function (u, pwd) {
		if (u === "") {
      $scope.usernamePlaceholder = "Enter a username";
      $scope.noUsername = true;
    } else if (pwd === "") {
      $scope.pwdPlaceholder = "Enter a password";
      $scope.noPwd = true;
    } else {
      if ($scope.users[u] == pwd) {
        $scope.loggedIn = true;
        $scope.currentUser = u;
      } else {
        $scope.noUsername = true;
        $scope.username = "";
        $scope.pwd = "";
        $scope.usernamePlaceholder = "Incorrect details";
      }
    }
	};

  $scope.usernameChanged = function() {
    $scope.noUsername = false;
    $scope.usernamePlaceholder = "username";
  }

  $scope.pwdChanged = function() {
    $scope.noPwd = false;
    $scope.pwdPlaceholder = "password";
  }

  $scope.registerButton = function() {
    alert("Register...");
  }

  $scope.logout = function() {
    $scope.loggedIn = false;
    $scope.currentUser = "";
    $scope.username = "";
    $scope.pwd = "";
  }

});
