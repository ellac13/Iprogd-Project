// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
phisancaApp.factory('Weather',function ($resource,$cookies,$firebaseAuth) {

    var model = this;

    //Current location data
    var activeAddress = "dummystan";
    var activeLat = 0.0;
    var activeLng = 0.0;

    this.getActiveAddress = function(){
        return activeAddress;
    }

    this.getActiveLat = function(){
        return activeLat;
    }

    this.getActiveLng = function(){
        return activeLng;
    }

    //User data
    var activeUser = "";
    var userFavourites =  ["Stockholm", "Kalmar"];
    var popularLocations =  ["Göteborg", "Malmö"];
    var recentSearches =  ["Kiruna", "Ystad"]; //This should be a queue of length 5{history length}

    //Getters for user data
    this.getUsername = function() {
        return activeUser;
    }

    this.getUserFavouriteLocations = function() {
        return userFavourites;
    }

    this.getPopularLocations = function() {
        return popularLocations;
    }

    this.getRecentSearches = function() {
        return recentSearches;
    }

    this.addFavouriteLocation = function(address){
        if(!userFavourites.includes(address)){
            //Remove address from other lists
            var i = popularLocations.indexOf(address);
            if(i != -1){
                popularLocations.splice(i, 1);
            }
            i = recentSearches.indexOf(address);
            if(i != -1){
                recentSearches.splice(i, 1);
            }

            userFavourites.push(address);
        }
    }

    this.removeFavouriteLocation = function(address){
        //Remove address from user favourites
        var i = userFavourites.indexOf(address);
        if(i != -1){
            userFavourites.splice(i, 1);
        }

        //TODO: Re-fetch the popular locations from database
    }


    //Search functionality here?
    this.searchWeatherWithAddress = function(address, $rootScope){
        //If the search was already in the recent search list, move it to the top
        var i = recentSearches.indexOf(address);
        if(i != -1){
            recentSearches.splice(i, 1);
            recentSearches.unshift(address); //Add first in queue
        }//Add address to recent searches
        else if(!userFavourites.includes(address)){
            recentSearches.unshift(address); //Add first in queue
            if(recentSearches.length > 5){
                recentSearches.pop();   //Remove last from queue
            }
        }

        //Conver the address to coordinates and search for weather with those coordinates
        console.log('Trying to convert address "' + address + '" to coordinates');
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                //Please note that if the input is garbage, ie. randomly typed characters
                //the returned location will be exactly the same amount of garbage, ie randomly approximated location
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                var formattedAddr = results[0].formatted_address;
                console.log('LatLng found: ' + lat + ', ' + lng);
                console.log('Address of LatLng: ' + formattedAddr);
                //console.log(results);

                //Update active address
                //activeAddress = address;
                activeAddress = formattedAddr;
                //$rootScope.$apply(function(){$scope.activeAddress});
                $rootScope.$apply();

                //Search for weather
                model.searchWeatherWithCoordinates(lat, lng);
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
        });

    }

    this.searchWeatherWithCoordinates = function(latidute, longitude){
        //Do searching with dark sky...
    }

    this.testGeolocation = function() {
        console.log('testing geolocation, mvh weatherService.js')
        geocoder = new google.maps.Geocoder();
        request = [];
        address = "Vallentuna";
        latlng = {lat: 59.537101, lng: 18.089940};
        //geocoder.geocode({'location': latlng}, function(results, status) {
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                console.log('Results found:');
                console.log(results);
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
      });
    }
    //this.testGeolocation();

    //////////////////////////Map stuff below//////////////////////////
    var weatherData = [[50.22, -2.244, "1", "images/weatherIcons/Cloud.png"],
                 [56.3443, 7.99, "2", "images/weatherIcons/Sun.png"], 
                 [49.33, 7.9826, "3", "images/weatherIcons/Heavy Rain.png"],
                 [60.9808, 12.3343, "4", "images/weatherIcons/Partly Cloudy Rain.png"]];

    var map = {
        center: { 
            latitude: 59.332469, 
            longitude: 18.065134 }, 
            zoom: 3 };
    var markers = [];

    this.getWeatherData = function(){
        return weatherData;
    }

    this.setMap = function(m){
        map = m;
    }

    this.getMap = function(){
        return map;
    }

    this.getMarkers = function(){
        return markers;
    }

    // Marker data should be an array with the following structure:
    // [latidute, longitude, temperature, url to image]
    var lastID = 0;
    this.addMarker = function(markerData){
        var latitude = markerData[0];
        var longitude = markerData[1];
        
        var ret = {
            latitude: latitude,
            longitude: longitude,
            title: 'm' + lastID++,
            show: true,
            id: lastID,
            icon: {
                url: markerData[3],

            },
            options: {
                labelClass:'marker_labels',
                labelAnchor:'-30 40',
                labelContent: markerData[2] + "°"
            }
        };
      markers.push(ret);        
    }



    /////////////////////// Firebase ///////////////////////////

    var auth = $firebaseAuth();

    this.getAuth = function() {
      return auth;
    }


    /////////////////////// Weather API ///////////////////////////

    this.findWeather = $resource("http://83.251.29.83:60000/myproxy/myproxy.php?", {}, {});
    /*
        Sample use of this resource e.g. inside a controller:

        $scope.getWeatherForPosition = function(lat, lon){
            Weather.findWeather.get({lat:lat,lon:lon}, function(data){
                console.log("success");
                console.log(data);
            }, function(data){
                console.log("Failed to get weather for position: latitude:" + lat + ", longitude: " + lon);
            });
        }
        //Then call the above function
        $scope.getWeatherForPosition(22.5566, 23.4556);
        */

    

    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;
});
