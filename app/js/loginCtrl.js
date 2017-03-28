
phisancaApp.controller('LoginCtrl', function ($scope,Weather,$mdDialog) {

  $scope.usernamePlaceholder = "username";
  $scope.pwdPlaceholder = "password";

  $scope.username = "";
  $scope.pwd = "";

  $scope.noUsername = false;        //An empty username was sent
  $scope.noPwd = false;             //An empty pwd was sent

  $scope.user = Weather.getUser();
  var auth = Weather.getAuth();

  auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.user = Weather.getUser();
  });

  $scope.login = function (u, pwd) {
		if (u === "") {
      $scope.usernamePlaceholder = "Enter a username";
      $scope.noUsername = true;
    } else if (pwd === "") {
      $scope.pwdPlaceholder = "Enter a password";
      $scope.noPwd = true;
    } else {
      Weather.login(u, pwd, function(error) {
        alert("Authentication failed: " + error);
      });
    }
	};

  $scope.usernameChanged = function() {
    $scope.noUsername = false;
    $scope.usernamePlaceholder = "username";
  };

  $scope.pwdChanged = function() {
    $scope.noPwd = false;
    $scope.pwdPlaceholder = "password";
  };

  $scope.registerButton = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'partials/registerDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function() {
    });
  };

  $scope.settingsButton = function(ev) {
    $mdDialog.show({
      controller: SettingsController,
      templateUrl: 'partials/settingsDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function() {
    });
  };

  $scope.logout = function() {
    Weather.logout();
    $scope.username = "";
    $scope.pwd = "";
  };

  function DialogController($scope, $mdDialog) {
    $scope.status = "";
    $scope.error = false;

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.register = function(email, pwd) {
      Weather.register(email, pwd, $scope, function(error, scope) {
          scope.email = "";
          scope.pass = "";
          scope.error = true;
          scope.status = error;
          console.error("Error: ", error);
      });
    };

    $scope.emailChanged = function() {
      $scope.noEmail = false;
      $scope.emailPlaceholder = "username";
    };

    $scope.passChanged = function() {
      $scope.noPass = false;
      $scope.passPlaceholder = "password";
    };
  }

  function SettingsController($scope, $mdDialog) {
    $scope.pwdStatus = "Error placeholder";
    $scope.usernameStatus = "Error placeholder";
    $scope.error = true;    //Should be false

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.updatePwd = function(oldPwd, newPwd, newPwd2) {
      //TODO: Check newPwd === newPwd2, check oldPwd
      $scope.error = false;
      $scope.oldPwd = "";
      $scope.newPwd = "";
      $scope.newPwd2 = "";
      Weather.updatePwd(newPwd, $scope, function(error, scope) {
          scope.error = true;
          scope.pwdStatus = error;
          console.error("Error: ", error);
      });
    };

    $scope.updateUsername = function(newUsername) {
      //TODO
    }
  }

});
