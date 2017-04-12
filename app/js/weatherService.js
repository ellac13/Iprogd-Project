// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
phisancaApp.factory('Weather',function ($resource,$cookies,$firebaseAuth) {

    var INVALID_ADDRESS = "Unknown address";

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


    var apikeys = 
        ["6acbd836627174487a78deec700c2145",
        "0567ae6243f12d4dae11eb0bb3e3f929",
        "f4fd75b39585aabceee20dcde734bc5e",
        "c47c5308f3f951df3de5802dd0749ff1",
        "e4de76fd41d3be73d909c8955d87842c",
        "6d252f2f4600ca24c2a426598ea9249f",
        "46ad276033757de21e86eb848ca1cff6",
        "1a7fcf38a7a7c129acd214edd7527127",
        "fcee5cad5967c9cbfcaab38fb0adc8c0",
        "abc1511d6995860ffff7ea0a509b190a",
        "c384722ceb3b99067d4f633518e201e4",
        "fa6831ab8b0014524c67ed9917191b00",
        "b4243c6606889c3ad13c7e5f4ab23903",
        "e7a849e89c0062ffc8efdf6201a9c91a",
        "7ee2685e37f178555c050b292dfd4f22",
        "22b6f091e930aa8a829cab76f3f6dcb7",
        "00efa9bbccef2cf85a03ddba7485fd0e",
        "214c8cdbd91be4887fac4e0902cd6cfc",
        "32d09896b99161bed7526bb9d8894ae9",
        "95d20d0fd3e79a19dd94d39b934ef3c4"];
    // Resource to communicate with dark sky api.
    //Public proxy
    var findWeather = $resource("https://crossorigin.me/https://api.darksky.net/forecast/" +
        apikeys[new Date().getMilliseconds()%apikeys.length] + "/:lat,:lon" + "?units=si", {}, {
    //Laptop proxy
    //var findWeather = $resource("http://myip:myport/myproxy/myproxy.php?lat=:lat&lon=:lon" + "&units=si", {}, {
    //Tablet proxy
    //var findWeather = $resource("http://83.251.29.83:60000/?lat=:lat&lon=:lon&key=" + apikeys[new Date().getMilliseconds()%apikeys.length], {}, {
        get: {
            headers:{
                'Content-type': 'application/json'
            }
        }
        });

    //Status message to show when weather is loading. Is set to "" when finished loading.
    var loadingWeatherMessage = "Fetching weather...";

    this.getLoadingWeatherMessage = function(){
        return loadingWeatherMessage;
    }

    // Fetches weather from dark sky for the parameterized coordinates
    // and sets it to the activeWeatherData variable
    var setWeather = function(lat, lon){
        loadingWeatherMessage = "Fetching weather...";
        findWeather.get({lat:lat,lon:lon}, function(data){
            activeWeatherData = data;
            setHourlyWeather();
			setDailyWeather();
            fetchSurroundingWeatherData();
            updateMap();
            //console.log(data);
            console.log("Successfully set weather data for lat: " + lat + ", lon: " + lon);
            loadingWeatherMessage = "";
        }, function(data){
            loadingWeatherMessage = "Failed to load weather, try again later.";
        });
    }

		///////////////////Firebase Storage////////////////////////////////

	var displayName = [];
    var currentUser;
	var feelsMod = [];
    var popularLocations =  [];
	var userFavourites =  [];
		
	var database = firebase.database();

	/////////Popular locations//////////
	
	var saveData = function(addressToBeSaved){
		var numOfTimeRef = database.ref('PopularSearches/' + addressToBeSaved);

		var numOfTimes = 0;
		numOfTimeRef.once('value').then(function(snapshot){
			var locations = snapshot.key;
			numOfTimes = snapshot.val();
			numOfTimes = numOfTimes +1;
			database.ref().child("PopularSearches").child(addressToBeSaved).set(numOfTimes);
			updatePopularLocations();
		}, function(error){
			console.error(error);
		});
	}

	var updatePopularLocations = function(){
		var temp = [0];
		var popularSearches = database.ref('PopularSearches/');
		popularSearches.once('value').then(function(snapshot){
			var i = 0;
			snapshot.forEach(function(childSnapshot){
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				if(userFavourites.includes(childKey)){
					return;
				}
				for(var j = 0; j < temp.length; j++){
					if(temp[j] <= childData){
						temp.splice(j,0,childData);
						popularLocations.splice(j,0,childKey);
						break;
					}
				}
			});
			//console.log('Current popular locations ', popularLocations);
		}, function(error){
			console.error(error);
		});
	}
		
	////////Favourite locations//////////
	
	var saveFavouriteLocations = function(addressToBeSaved){
		database.ref().child(currentUser.uid).child('/FavouriteLocations/').child(addressToBeSaved).set('true');
	}
	
	var deleteFavouriteLocations = function(addressToBeRemoved){
		database.ref().child(currentUser.uid).child('/FavouriteLocations/').child(addressToBeRemoved).set(null);
	}
	
	var updateFavouriteLocations = function(useruid){
		var userFavLocRef = database.ref(useruid + '/FavouriteLocations/');
		userFavLocRef.once('value').then(function(snapshot){
			var i = 0;
			snapshot.forEach(function(childSnapshot){
				var childKey = childSnapshot.key;
				userFavourites.splice(i, 0, childKey);
				i++;
			});
			console.log('User favourites: ', userFavourites);
		}, function(error){
			console.error(error);
		});
	}
		
	//////FeelsLike//////	
	
	this.getUserFeelsMod = function(){
		//console.log('Got the feels ', feelsMod);
		return feelsMod;
	}
		
	var readUserFeelsMod = function(useruid) {
		console.log(useruid);
		var userFeelsLikeRef = database.ref(useruid + '/FeelsLike/');
		userFeelsLikeRef.once('value').then(function(snapshot){
			var val = snapshot.val();
			feelsMod.splice(0, 1, val);
			console.log(feelsMod[0]);
		}, function(error){
			console.error(error);
		});
	}

	this.increaseUserFeelsMod = function(delta) {
		//TODO: Update actual value in storage
		feelsMod[0] +=delta;
		var userFeelsLikeRef = database.ref(currentUser.uid + '/FeelsLike/');
		userFeelsLikeRef.once('value').then(function(snapshot){
			var val = snapshot.val();
			val += delta;
			feelsMod.splice(0,1,val);
			console.log('The feels increased with ', delta);
			console.log('FeelsMod ', feelsMod[0]);
			var temp = feelsMod[0];
			database.ref().child(currentUser.uid).child('/FeelsLike/').set(temp);
		}, function(error){
			console.error(error);
		});
	}

	
	//////FIREBASE DISPLAYNAME//////
	
	
	var storeDisplayName = function(nameToBeStored, useruid){
		console.log('Displayname will be stored: ', nameToBeStored);
		displayName.splice(0,1,nameToBeStored);
		database.ref().child(useruid).child('/DisplayName/').set(nameToBeStored);
	}
	
	var updateDisplayName = function(useruid){
		var userDisplayNameRef = database.ref(useruid + '/DisplayName/');
		userDisplayNameRef.once('value').then(function(snapshot){
			displayName[0] = snapshot.val();
		}, function(error){
			console.error(error);
		});
	}
	
	this.getDisplayName = function(){
		return displayName;
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
        hourlyWeekDays[i] = getDay(hourlyData[i].time);
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
			dayOfWeek = 'Sun';
		}else if(format === 1){
			dayOfWeek = 'Mon';
		}else if(format === 2){
			dayOfWeek = 'Tue';
		}else if(format === 3){
			dayOfWeek = 'Wed';
		}else if(format === 4){
			dayOfWeek = 'Thu';
		}else if(format === 5){
			dayOfWeek = 'Fri';
		}else{
			dayOfWeek = 'Sat';
		}
		return dayOfWeek;
	}

    //Initial arrays of length 24
    var hourlyTimes = Array.apply(null, Array(24)).map(String.prototype.valueOf,"");
    var hourlyDates = Array.apply(null, Array(24)).map(String.prototype.valueOf,"");
    var hourlyWeekDays = Array.apply(null, Array(24)).map(String.prototype.valueOf,"");
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

    this.getHourlyWeekDays = function() {
      return hourlyWeekDays;
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
			saveFavouriteLocations(address);
        }else{
            removeFavouriteLocation(address);
			deleteFavouriteLocations(address);
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

		updatePopularLocations();
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

		saveData(address);

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
              } else {
                console.log('No results found');
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              //Update active address
              //activeAddress = address;
              activeAddress = INVALID_ADDRESS;

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
              activeAddress = INVALID_ADDRESS;

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
    var map = [];

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

        //Remove decimals from temperature...
        var temp = markerData[2];
        if(temp%1 > 1/2){
            temp = parseInt(temp) + 1;
        } else {
            temp = parseInt(temp);
        }

        var ret = {
            latitude: latitude,
            longitude: longitude,
            title: 'm' + lastID++,
            show: true,
            id: lastID,
            icon: {
                url: markerData[3],
                scaledSize: { width: 40, height: 40 }
            },
            options: {
                labelClass:'marker_labels',
                labelAnchor:'-28 25',
                labelContent: temp + "°",
                zIndex: 1,
                optimized: false
            }
        };
        lastID++;
      markers.push(ret);
    }

    var updateMap = function(){
        markers = [];

        map.center = {latitude: model.getActiveLat(),
                      longitude: model.getActiveLng()};
        //map.zoom = 8;

        //Add middle marker
        model.addMarker([model.getActiveLat(),
                        model.getActiveLng(),
                        hourlyTemps[currentTimeIndex],
                        "images/weatherIcons/" + hourlyIcons[currentTimeIndex] + ".svg"]);
        //Add marker to indicate which is the center
        markers.push({
                        latitude: model.getActiveLat(),
                        longitude: model.getActiveLng(),
                        show: true,
                        id: ++lastID,
                        options: {
                            zIndex: 2,
                            optimized: false
                        },
                        icon: {
                            url: "images/locationIcons/red-dot.svg",
                            scaledSize: {width: 15, height: 15},
                            anchor: new google.maps.Point(8, 28)
                        }
                    });


        //Add surrounding markers
        for(loc in surrLocations){
            if(!surrLocations[loc].usable) continue;
            model.addMarker([surrLocations[loc].lat,
                        surrLocations[loc].lon,
                        surrHourlyTemps[loc][currentTimeIndex],
                        "images/weatherIcons/" + surrHourlyIcons[loc][currentTimeIndex] + ".svg"]);
        }
    }

    var surrLocations = {n: {usable: false, lat:0, lon:0, id:0},
                         s: {usable: false, lat:0, lon:0, id:0},
                         e: {usable: false, lat:0, lon:0, id:0},
                         w: {usable: false, lat:0, lon:0, id:0}
                        }

    var surrHourlyTemps = {n: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
                           s: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
                           e: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
                           w: Array.apply(null, Array(24)).map(Number.prototype.valueOf,0)};
    var surrHourlyIcons = {n: Array.apply(null, Array(24)).map(String.prototype.valueOf,""),
                           s: Array.apply(null, Array(24)).map(String.prototype.valueOf,""),
                           e: Array.apply(null, Array(24)).map(String.prototype.valueOf,""),
                           w: Array.apply(null, Array(24)).map(String.prototype.valueOf,"")};



    //Saves the fetched weather data and adds a marker.
    var setSurroundingHourlyWeather = function(sWeatherData, pos, id) {
        if(surrLocations[pos].id != id){
            //alert("Tried to add old surrWeather, id:" + id + ", surrID:" + surrLocations[pos].id);
            return;
        }
        var hourlyData = sWeatherData.hourly.data;
        for (var i = 0; i < hourlyData.length / 2; i++) {
        surrHourlyTemps[pos][i] = hourlyData[i].temperature;
        surrHourlyIcons[pos][i] = hourlyData[i].icon;
        }
        //Save locations
        surrLocations[pos].lat = sWeatherData.latitude;
        surrLocations[pos].lon = sWeatherData.longitude;
        surrLocations[pos].usable = true;
        
        //Add the marker...
        model.addMarker([sWeatherData.latitude,
                        sWeatherData.longitude,
                        surrHourlyTemps[pos][currentTimeIndex],
                        "images/weatherIcons/" + surrHourlyIcons[pos][currentTimeIndex] + ".svg"]);
        
    }

    // Fetches weather data for the locations surrounding the current location
    // and saves it.
    var fetchSurroundingWeatherData = function(){
        //Begin with marking old data as old...
        for(loc in surrLocations){
            surrLocations[loc].usable = false;
        }

        var cLat = model.getActiveLat();
        var cLon = model.getActiveLng();
        var surrCoords = [{pos: "n", coords: {lat: cLat+0.3*(Math.random()+0.6),lon: cLon+0.3*(Math.random()-0.5)}, id: Math.random()},
                          {pos: "s", coords: {lat: cLat-0.3*(Math.random()+0.6),lon: cLon+0.3*(Math.random()-0.5)}, id: Math.random()},
                          {pos: "e", coords: {lat: cLat+0.3*(Math.random()-0.5),lon: cLon+0.3*(Math.random()+0.6)}, id: Math.random()},
                          {pos: "w", coords: {lat: cLat+0.3*(Math.random()-0.5),lon: cLon-0.3*(Math.random()+0.6)}, id: Math.random()}];

        //Set id:s for all surrounding coordinates
        surrLocations["n"].id = surrCoords[0].id;
        surrLocations["s"].id = surrCoords[1].id;
        surrLocations["e"].id = surrCoords[2].id;
        surrLocations["w"].id = surrCoords[3].id;

        //Ugly but working solution..... Hämta väder för ne,sw,se,nw
        findWeather.get({lat:surrCoords[0].coords.lat,lon:surrCoords[0].coords.lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[0].pos, surrCoords[0].id);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });

        findWeather.get({lat:surrCoords[1].coords.lat,lon:surrCoords[1].coords.lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[1].pos, surrCoords[1].id);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });

        findWeather.get({lat:surrCoords[2].coords.lat,lon:surrCoords[2].coords.lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[2].pos, surrCoords[2].id);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });

        findWeather.get({lat:surrCoords[3].coords.lat,lon:surrCoords[3].coords.lon}, function(data){
            setSurroundingHourlyWeather(data, surrCoords[3].pos, surrCoords[3].id);
        }, function(data){
            throw "Error while fetching weather data!!!";
        });
    }


    /////////////////////// Firebase ///////////////////////////

    var auth = $firebaseAuth();

    this.getAuth = function() {
      return auth;
    }

    this.login = function(email, pwd, $loginScope, errorfunc) {
      auth.$signInWithEmailAndPassword(email, pwd).then(function(firebaseUser) {
        console.log("Signed in as: ", firebaseUser.uid);
		updateDisplayName(firebaseUser.uid);
		readUserFeelsMod(firebaseUser.uid);
		updateFavouriteLocations(firebaseUser.uid);
		updatePopularLocations();
      }).catch(function(error) {
        errorfunc(error, $loginScope);
        console.error("Authentication failed:", error);
      });
    }

    this.register = function(email, disp, pwd, scope, errorfunc) {
      auth.$createUserWithEmailAndPassword(email, pwd)
        .then(function(firebaseUser) {
          console.log("User " + firebaseUser.uid + " created successfully!");

          // TODO: Add displayname!
          scope.answer();
		  storeDisplayName(disp, firebaseUser.uid);
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

    this.updateUsername = function(newDisplayname, scope, successfunc, errorfunc) {
      if (newDisplayname.length > 0) {
        successfunc(scope);
		var user = model.getUser();
		storeDisplayName(newDisplayname, user.uid);
      } else {
        errorfunc("Error: No username given", scope);
      }
    }

    this.logout = function() {
      auth.$signOut();
	  displayName[0] = '';
	  feelsMod[0] = 0;
	  userFavourites = [];
	  updatePopularLocations();
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
      currentUser = firebaseUser;
    });


    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;
});
