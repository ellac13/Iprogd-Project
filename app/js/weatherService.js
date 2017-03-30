// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
phisancaApp.factory('Weather',function ($resource,$cookies,$firebaseAuth) {

    var model = this;

    //Current location data
    var activeAddress = "No such location";
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

    //Current weather data
    var activeWeatherData = [];

    this.getActiveWeatherData = function(){
        return activeWeatherData;
    }

    // Resource to communicate with dark sky api.
    //var findWeather = $resource("https://crossorigin.me/https://api.darksky.net/forecast/6acbd836627174487a78deec700c2145/:lat,:lon" + "?units=si", {}, {
    var findWeather = $resource("http://83.251.29.83:60000/myproxy/myproxy.php?lat=:lat&lon=:lon" + "&units=si", {}, {
        get: {
            headers:{
                'Content-type': 'application/json'
            }
        }
        });

    // Fetches weather from dark sky for the parameterized coordinates
    // and sets it to the activeWeatherData variable
    var setWeather = function(lat, lon){
        findWeather.get({lat:lat,lon:lon}, function(data){
            activeWeatherData = data;
            setHourlyWeather();
			setDailyWeather();
            updateMap();
            //console.log(data);
            console.log("Successfully set weather data for lat: " + lat + ", lon: " + lon);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });
    }

    ////////////////////// Current Weather /////////////////////////////

    //The current time in index form
    var currentTimeIndex = 0;

    //Sets temps and times for next 24 hours (half of all data read)
    var setHourlyWeather = function() {
      var hourlyData = activeWeatherData.hourly.data;
      for (var i = 0; i < hourlyData.length / 2; i++) {
        hourlyTemps[i] = hourlyData[i].temperature;
        hourlyFeels[i] = hourlyData[i].apparentTemperature;
        hourlyTimes[i] = getTime(hourlyData[i].time);
        hourlyDates[i] = getDate(hourlyData[i].time);
        hourlyIcons[i] = hourlyData[i].icon;
      }
    }

		//Daily data
	var setDailyWeather = function(){
		var dailyData = activeWeatherData.daily.data;
		for(var i = 0; i < dailyData.length; i++){
			dailyDate[i] = getDay(dailyData[i].time);
			dailyTemp[i] = dailyData[i].temperatureMax;
			dailyWeather[i] = dailyData[i].icon;
		}
	}

    // Helper function to convert from UNIX to real time
    var getTime = function(unixTime) {
      var date = new Date(parseInt(unixTime)*1000);
      // Hours part from the timestamp
      var hours = "0" + date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();

      // Will display time in 10:30 format
      var time = hours.substr(-2) + ':' + minutes.substr(-2);
      return time;
    }

    var getDate = function(unixTime) {
      var date = new Date(parseInt(unixTime)*1000);
      var formatDate = date.getDate() + "/" + (date.getMonth() + 1);
      return formatDate;
    }

	var getDay = function(unixTime){
		var day = new Date(parseInt(unixTime)*1000);
		var format = day.getDay();
		var dayOfWeek = '';
		if(format === 0){
			dayOfWeek = 'Sunday';
		}else if(format === 1){
			dayOfWeek = 'Monday';
		}else if(format === 2){
			dayOfWeek = 'Tuesday';
		}else if(format === 3){
			dayOfWeek = 'Wednsday';
		}else if(format === 4){
			dayOfWeek = 'Thursday';
		}else if(format === 5){
			dayOfWeek = 'Friday';
		}else{
			dayOfWeek = 'Saturday';
		}
		return dayOfWeek;
	}

    //Initial arrays of length 24
    var hourlyTimes = Array.apply(null, Array(24)).map(String.prototype.valueOf,"");
    var hourlyDates = Array.apply(null, Array(24)).map(String.prototype.valueOf,"");
    var hourlyTemps = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0);
    var hourlyFeels = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0);
    var hourlyIcons = Array.apply(null, Array(24)).map(String.prototype.valueOf,"");


	var dailyDate = Array.apply(null, Array(8)).map(String.prototype.valueOf,"");
	var dailyTemp = Array.apply(null, Array(8)).map(String.prototype.valueOf,"");
	var dailyWeather = Array.apply(null, Array(8)).map(String.prototype.valueOf,"");


    this.getHourlyTimes = function() {
      return hourlyTimes;
    }

    this.getHourlyTemps = function() {
      return hourlyTemps;
    }

    this.getHourlyFeels = function() {
      return hourlyFeels;
    }

    this.getHourlyIcons = function() {
      return hourlyIcons;
    }


	this.getDailyDate = function(){
		return dailyDate;
	}

	this.getDailyTemp = function(){
		return dailyTemp;
	}

	this.getDailyWeather = function(){
		return dailyWeather;
	}


    this.getCurrentTimeIndex = function() {
      return currentTimeIndex;
    }

    this.getHourlyDates = function() {
      return hourlyDates;
    }

    this.setCurrentTimeIndex = function(newValue) {
      currentTimeIndex = newValue;
      updateMap();
    }

    //User data

    var currentUser;
    var userFavourites =  ["Stockholm", "Kalmar"];
    var popularLocations =  ["Göteborg", "Malmö"];
    var recentSearches =  ["Kiruna", "Ystad"]; //This should be a queue of length 5{history length}

    //Getters for user data
    this.getUser = function() {
      return currentUser;
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

    this.toggleFavouriteLocation = function(address){
        if(!userFavourites.includes(address)){
            addFavouriteLocation(address);
        }else{
            removeFavouriteLocation(address);
        }
    }

    var addFavouriteLocation = function(address){
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

    var removeFavouriteLocation = function(address){
        //Remove address from user favourites
        var i = userFavourites.indexOf(address);
        if(i != -1){
            userFavourites.splice(i, 1);
        }

        //TODO: Re-fetch the popular locations from database
    }


    //Search functionality here?
    this.updateLocationWithAddress = function(address, $rootScope){
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

        //Convert the address to coordinates and search for weather with those coordinates
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

                //Update active coordinates
                activeLat = lat;
                activeLng = lng;

                //Inform view that an async change happend to the model
                $rootScope.$apply();

                //Search for weather of active position
                model.weatherSearchWithCurrentLocation();
				model.saveData();
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              //Update active address
              //activeAddress = address;
              activeAddress = "Nolocation";

              //Update active coordinates
              activeLat = 0.0;
              activeLng = 0.0;

              //Inform view that an async change happend to the model
              $rootScope.$apply();
            }
        });

    }

    this.updateLocationWithCoordinates = function(latidute, longitude, $rootScope){

        //Get address of the coordinates and search for weather with  coordinates
        console.log('Trying to convert coordinates "' + latidute + ', ' + longitude +'" to address');
        geocoder = new google.maps.Geocoder();
        latlng = {lat: latidute, lng: longitude};
        geocoder.geocode({'location': latlng}, function(results, status) {
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

                //Update active coordinates
                activeLat = lat;
                activeLng = lng;

                //Inform view that an async change happend to the model
                $rootScope.$apply();

                //Search for weather of active position
                model.weatherSearchWithCurrentLocation();
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              //Update active address
              //activeAddress = address;
              activeAddress = "Nolocation";

              //Update active coordinates
              activeLat = 0.0;
              activeLng = 0.0;

              //Inform view that an async change happend to the model
              $rootScope.$apply();
            }
        });
    }

    this.weatherSearchWithCurrentLocation = function(){
        //Do searching with dark sky...
        var lat = model.getActiveLat();
        var lon = model.getActiveLng();
        setWeather(lat, lon);
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
    var map = {
        center: {
            latitude: 59.332469,
            longitude: 18.065134
            },
        zoom: 8,
        options:{
            streetViewControl: false,
            mapTypeControl: false
            }
        };

    var markers = [];

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

        //Remove decimals...
        var temp = String(markerData[2]);
        temp = temp.slice(0, temp.indexOf("."));

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
                labelAnchor:'-28 25',
                labelContent: temp + "°",
            }
        };
      markers.push(ret);
    }

    var updateMap = function(){
        markers = [];

        map.center = {latitude: model.getActiveLat(),
                      longitude: model.getActiveLng()}

        model.addMarker([model.getActiveLat(),
                        model.getActiveLng(),
                        hourlyTemps[currentTimeIndex],
                        "images/weatherIcons/" + hourlyIcons[currentTimeIndex] + ".png"]);
        createSurroundingMarkers();
    }

    var surrHourlyTemps = {n: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
                           s: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
                           w: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
                           e: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0)};
    var surrHourlyIcons = {n: Array.apply(null, Array(24)).map(String.prototype.valueOf,""),
                           s: Array.apply(null, Array(24)).map(String.prototype.valueOf,""),
                           w: Array.apply(null, Array(24)).map(String.prototype.valueOf,""),
                           e: Array.apply(null, Array(24)).map(String.prototype.valueOf,"")};

    var setSurroundingHourlyWeather = function(sWeatherData, pos) {
      var hourlyData = sWeatherData.hourly.data;
      for (var i = 0; i < hourlyData.length / 2; i++) {
        surrHourlyTemps[pos][i] = hourlyData[i].temperature;
        surrHourlyIcons[pos][i] = hourlyData[i].icon;
      }
      //Add the marker...
      model.addMarker([sWeatherData.latitude,
                        sWeatherData.longitude,
                        surrHourlyTemps[pos][currentTimeIndex],
                        "images/weatherIcons/" + surrHourlyIcons[pos][currentTimeIndex] + ".png"]);
    }

    var createSurroundingMarkers = function(){
        var cLat = map.center.latitude;
        var cLon = map.center.longitude;
        var surrCoords = [{pos: "n", lat: cLat+0.3,lon: cLon},
                          {pos: "s", lat: cLat-0.3,lon: cLon},
                          {pos: "e", lat: cLat,lon: cLon+0.5},
                          {pos: "w", lat: cLat,lon: cLon-0.5}];
        //Ugly but working solution..... Hämta väder för n,s,w,e
        findWeather.get({lat:surrCoords[0].lat,lon:surrCoords[0].lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[0].pos);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });

        findWeather.get({lat:surrCoords[1].lat,lon:surrCoords[1].lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[1].pos);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });

        findWeather.get({lat:surrCoords[2].lat,lon:surrCoords[2].lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[2].pos);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });

        findWeather.get({lat:surrCoords[3].lat,lon:surrCoords[3].lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[3].pos);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });
    }


    /////////////////////// Firebase ///////////////////////////

    var auth = $firebaseAuth();

    this.getAuth = function() {
      return auth;
    }

    this.login = function(email, pwd, errorfunc) {
      auth.$signInWithEmailAndPassword(email, pwd).then(function(firebaseUser) {
        console.log("Signed in as: ", firebaseUser.uid);
      }).catch(function(error) {
        errorfunc(error);
        console.error("Authentication failed:", error);
      });
    }

    this.register = function(email, pwd, scope, errorfunc) {
      auth.$createUserWithEmailAndPassword(email, pwd)
        .then(function(firebaseUser) {
          console.log("User " + firebaseUser.uid + " created successfully!");
          scope.answer();
        }).catch(function(error) {
          errorfunc(error, scope);
        });
    }

    this.updatePwd = function(oldPwd, pwd, scope, successfunc, errorfunc) {
      var credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, oldPwd);
      auth.$signInWithCredential(credential).then(function(firebaseUser) {
        auth.$updatePassword(pwd).then(function() {
          successfunc(scope);
          console.log("Password changed successfully!");
        }).catch(function(error) {
          errorfunc(error, scope);
        });
      }).catch(function(error) {
        errorfunc(error, scope);
      });
    }

    this.updateUsername = function(newUsername, scope, successfunc, errorfunc) {
      if (newUsername.length > 0) {
        successfunc(scope);
      } else {
        errorfunc("Error: No username given", scope);
      }
    }

    this.logout = function() {
      auth.$signOut();
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
      currentUser = firebaseUser;
    });

	///////////////////Firebase Storage////////////////////////////////

	var database = firebase.database().ref();

	this.saveData = function(){
		database.child("Popular").set("data");
	}


    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;
});
