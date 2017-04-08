phisancaApp.controller("someController", function ($scope, uiGmapGoogleMapApi,Weather,$interval,$location) {
    Weather.setMap(
        {
            center: {
                latitude: 59.332469,
                longitude: 18.065134
                },
            zoom: 8,
            options:{
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
                },
            styles: [
                {
                    "featureType":"road",
                    "elementType":"labels",
                    "stylers":[{"visibility":"on"}]
                },
                {
                    "featureType":"poi",
                    "stylers":[{"visibility":"off"}]
                },
                {
                    "featureType":"administrative",
                    "stylers":[{"visibility":"off"}]
                },
                {
                    "featureType":"road",
                    "elementType":"geometry.fill",
                    "stylers":[{"color":"#000000"}, {"weight":1}]
                },
                {
                    "featureType":"road",
                    "elementType":"geometry.stroke",
                    "stylers":[{"color":"#000000"},{"weight":0.8}]
                },
                {
                    "featureType":"landscape",
                    "stylers":[{"color":"#ffffff"}]
                },
                {
                    "featureType":"water",
                    "stylers":[{"visibility":"off"}]
                },
                {
                    "featureType":"transit",
                    "stylers":[{"visibility":"off"}]
                },
                {
                    "elementType":"labels",
                    "stylers":[{"visibility":"off"}]
                },
                {
                    "elementType":"labels.text",
                    "stylers":[{"visibility":"on"}]
                },
                {
                    "elementType":"labels.text.stroke",
                    "stylers":[{"color":"#ffffff"}]
                },
                {
                    "elementType":"labels.text.fill",
                    "stylers":[{"color":"#000000"}]
                },
                {
                    "elementType":"labels.icon",
                    "stylers":[{"visibility":"on"}]
                }
            ]
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