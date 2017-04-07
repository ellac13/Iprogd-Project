
phisancaApp.controller('LoginCtrl', function ($scope,Weather,$mdDialog) {

  $scope.usernamePlaceholder = "username";
  $scope.pwdPlaceholder = "password";

  $scope.username = "";
  $scope.pwd = "";

  $scope.error = "";

  $scope.user = Weather.getUser();
  var auth = Weather.getAuth();

  auth.$onAuthStateChanged(function(firebaseUser) {
    $scope.user = Weather.getUser();
  });

  $scope.login = function (u, pwd) {
    $scope.error = "";
		if (u === "") {
      $scope.error = "No email entered";
    } else if (pwd === "") {
      $scope.error = "No password entered";
    } else {
      Weather.login(u, pwd, $scope, function(error, scope) {
        scope.error = error;
        scope.username = "";
        scope.pwd = "";
      });
    }
	};

  $scope.registerButton = function(ev) {
    if($scope.user === null){
		$mdDialog.show({
		controller: DialogController,
		templateUrl: 'partials/registerDialog.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true,
		fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	}).then(function() {
	});
	}else{
		$mdDialog.show({
		controller: SettingsController,
		templateUrl: 'partials/settingsDialog.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true,
		fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	}).then(function() {
	});
	}
  };

  $scope.checkUser = function(){
	if($scope.user === null){
		return 'Register';
	}else{
		return 'Settings';
	}
  }

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
    $scope.email = "";
    $scope.displayname = "";
    $scope.pass = "";
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

    $scope.register = function(email, disp, pwd) {
      Weather.register(email, disp, pwd, $scope, function(error, scope) {
          scope.email = "";
          scope.pass = "";
          scope.displayname = "";
          scope.error = true;
          scope.status = error;
          console.error("Error: ", error);
      });
    };
  }

  function SettingsController($scope, $mdDialog) {
    $scope.pwdStatus = "Error placeholder";
    $scope.usernameStatus = "Error placeholder";
    $scope.pwdError = "no";
    $scope.usernameError = "no";

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
      clearErrors();
      if (newPwd === newPwd2) {
        Weather.updatePwd(oldPwd, newPwd, $scope, function(scope) {
          scope.pwdError = "success";
          scope.pwdStatus = "Password successfully changed";
        }, function(error, scope) {
            scope.pwdError = "error";
            scope.pwdStatus = error;
            console.error("Error: ", error);
        });
      } else {
        $scope.pwdError = "error";
        $scope.pwdStatus = "Error: The passwords must be identical";
      }
    };

    $scope.updateUsername = function(newUsername) {
      clearErrors();
      Weather.updateUsername(newUsername, $scope, function(scope) {
        scope.usernameError = "success";
        scope.usernameStatus = "Username successfully changed";
      }, function(error, scope) {
          scope.usernameError = "error";
          scope.usernameStatus = error;
          console.error("Error: ", error);
      });
    }

    var clearErrors = function() {
      $scope.pwdError = "no";
      $scope.oldPwd = "";
      $scope.newPwd = "";
      $scope.newPwd2 = "";
      $scope.newUsername = "";
      $scope.usernameError = "no";
    }
  }

});
