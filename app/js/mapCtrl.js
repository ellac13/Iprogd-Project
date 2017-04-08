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
                    },
                bounds_changed: function(mapModel, eventName, originalEventArgs, $rootScope) {
                        /*var map = Weather.getMap();
                        console.log("Bounds changed.");
                        var activelat = Weather.getActiveLat();
                        var activelng = Weather.getActiveLng();
                        if(Math.abs(activelat-map.center.latitude) > 0.0001 && Math.abs(activelng-map.center.longitude) > 0.0001){
                            console.log("Bounds changed. New coords: lat=" + map.center.latitude + ", lng=" + map.center.longitude);
                            //Weather.fetchSurroundingWeatherData();    
                        }*/
                        
                    }
                }
        }
    );

    $scope.markers = Weather.getMarkers();
    $scope.map = Weather.getMap();
    $scope.activeWeatherData = Weather.getActiveWeatherData();

    $scope.status = "Loading map...";

    $interval(function(){
        $scope.markers = Weather.getMarkers();
    }, 100);

    //Callback function
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.status = "";

        
  
    }, function(){$scope.status = "Error loading map"});
});