
phisancaApp.controller('LoginCtrl', function ($scope,Weather,$mdDialog) {

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
  };

  $scope.pwdChanged = function() {
    $scope.noPwd = false;
    $scope.pwdPlaceholder = "password";
  };

  $scope.registerButton = function(ev) {
    // alert("Register...");
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

  $scope.logout = function() {
    $scope.auth.$signOut();
    $scope.username = "";
    $scope.pwd = "";
  };

  function DialogController($scope, $mdDialog) {
    $scope.emailPlaceholder = "username";
    $scope.passPlaceholder = "password";
    $scope.email = "";
    $scope.pass = "";
    $scope.noEmail = false;        //An empty username was sent
    $scope.noPass = false;             //An empty pwd was sent
    $scope.status = "lol";
    $scope.error = false;
    $scope.auth = Weather.getAuth();

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
      $scope.error = false;
      if (email === "") {
        $scope.emailPlaceholder = "Enter a username";
        $scope.noEmail = true;
      } else if (pwd === "") {
        $scope.passPlaceholder = "Enter a password";
        $scope.noPass = true;
      } else {
        $scope.auth.$createUserWithEmailAndPassword(email, pwd)
          .then(function(firebaseUser) {
            alert("User " + firebaseUser.uid + " created successfully!");
            console.log("User " + firebaseUser.uid + " created successfully!");
            $scope.answer();
          }).catch(function(error) {
            $scope.email = "";
            $scope.pass = "";
            $scope.error = true;
            $scope.status = error;
            alert(error);
            console.error("Error: ", error);
          });
      }
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

});
