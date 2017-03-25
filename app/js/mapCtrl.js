phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi, Weather) {
    $scope.markers = Weather.getMarkers();
    $scope.weatherData = Weather.getWeatherData();
    $scope.status = "Loading map";

    $scope.addMarker = function(markerData) {
        Weather.addMarker(markerData);
    }

    //Callback function
    uiGmapGoogleMapApi.then(function(maps) {
        $scope.status = "";
        var mapCanvas = document.getElementById("map");
        var myCenter = new google.maps.LatLng(51.508742,-0.120850);
        var mapOptions = {center: myCenter, zoom: 4};
        var tempMap = new google.maps.Map(mapCanvas,mapOptions);
        Weather.setMap(tempMap);


        for(var i = 0; i < $scope.weatherData.length; i++){
            var markerData = [$scope.weatherData[i][0], $scope.weatherData[i][1], $scope.weatherData[i][2], $scope.weatherData[i][3]]
            Weather.addMarker(markerData);
        }
    });
});