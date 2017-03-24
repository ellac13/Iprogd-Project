// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
phisancaApp.factory('Weather',function ($resource,$cookies) {

    var model = this;

    //Current location data
    var activeAddress = "";
    var activeLat = 0.0;
    var activeLng = 0.0;

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
    this.searchWeatherWithAddress = function(address){
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

        

        //Do actual searching...
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

    //////////////////////////Map stuff below//////////////////////////
    var weatherData = [[50.22, -2.244, "1", "star.png"],
                 [56.3443, 7.99, "2", "arrow.png"], 
                 [49.33, 7.9826, "3", "star.png"],
                 [60.9808, 12.3343, "4", "arrow.png"]];

    var map;
    var markers = [];

    // Marker data should be an array with the following structure:
    // [latidute, longitude, temperature, url to image]
    var addMarker = function(markerData){
        console.log("adding marker. Pos: " + markerData[0] + " " + markerData[1] + 
            ", temp: " + markerData[2]);
        
        //Create icon
        var image = {
                url: markerData[3],
                labelOrigin: new google.maps.Point(2,8)
            }

        // Create marker and add it to array markers
        markers.push(new google.maps.Marker({
                position: new google.maps.LatLng(markerData[0], markerData[1]),
                icon: image,
                label: markerData[2],
                map: map
            }));

        //Make sure that all markers are visible
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0; i < markers.length; i++){
            bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);
    }

    this.myMap = function() {
        var mapCanvas = document.getElementById("map");
        var myCenter = new google.maps.LatLng(51.508742,-0.120850);
        var mapOptions = {center: myCenter, zoom: 4};
        map = new google.maps.Map(mapCanvas,mapOptions);

        for(var i = 0; i < weatherData.length; i++){
            var markerData = [weatherData[i][0], weatherData[i][1], weatherData[i][2], weatherData[i][3]]
            addMarker(markerData);
        }
    }
    //this.testGeolocation();

    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;

});