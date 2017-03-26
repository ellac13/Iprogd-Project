
phisancaApp.controller('LoginCtrl', function ($scope,Weather) {

  $scope.usernamePlaceholder = "username";
  $scope.pwdPlaceholder = "password";

  $scope.username = "";
  $scope.pwd = "";

  $scope.noUsername = false;        //An empty username was sent
  $scope.noPwd = false;             //An empty pwd was sent

  $scope.auth = Weather.getAuth();

  $scope.login = function (u, pwd) {
		if (u === "") {
      $scope.usernamePlaceholder = "Enter a username";
      $scope.noUsername = true;
    } else if (pwd === "") {
      $scope.pwdPlaceholder = "Enter a password";
      $scope.noPwd = true;
    } else {
      $scope.auth.$signInWithEmailAndPassword(u, pwd).then(function(firebaseUser) {
        alert("Signed in as:" + firebaseUser.uid);
        console.log("Signed in as: ", firebaseUser.uid);
      }).catch(function(error) {
        alert("Authentication failed: " + error);
        console.error("Authentication failed:", error);
      });
    }
	};

  $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;
  });

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
    $scope.auth.$signOut();
    $scope.username = "";
    $scope.pwd = "";
  }

});
