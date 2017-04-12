phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi,Weather,$interval,$location) {
    Weather.setMap(
        {
            center: {
                latitude: 59.332469,
                longitude: 18.065134
                },
            bounds: {
                    northeast: {
                        latitude: "",
                        longitude:""
                    },
                    southwest: {
                        latitude:"",
                        longitude:""
                    }
                },
            zoom: 8,
            options:{
                minZoom: 2,
                maxZoom: 14,
                streetViewControl: false,
                mapTypeControl: false,
                disableDoubleClickZoom: true
                },
            events: {
                dblclick: function(mapModel, eventName, originalEventArgs, $rootScope) {
                        var clickedLat = originalEventArgs[0].latLng.lat();
                        var clickedLon = originalEventArgs[0].latLng.lng();
                        //Weather.updateLocationWithCoordinates(clickedLat, clickedLon, $scope);
                        $location.url('?lat=' + clickedLat + '&lng=' + clickedLon);
                        var tempMap = Weather.getMap();
                        tempMap.zoom = 8;
                        Weather.setMap(tempMap);
                    }
                }
        }
    );

    $scope.markers = Weather.getMarkers();
    $scope.map = Weather.getMap();
    $scope.activeWeatherData = Weather.getActiveWeatherData();

    //$scope.status = "Loading map...";
    $scope.status = Weather.getLoadingWeatherMessage();
    $scope.showMap = false;

    $interval(function(){
        $scope.markers = Weather.getMarkers();
    }, 100);

    $scope.loadingWeatherMessage = function(){
        $scope.status = Weather.getLoadingWeatherMessage();
        if($scope.status == ""){
            $scope.showMap = true;
        } else {
            $scope.showMap = false;
        }
        return $scope.status;
    }

    //Callback function
    uiGmapGoogleMapApi.then(function(maps) {
        //$scope.status = "";
    }, function(){$scope.status = "Error loading map"});
});