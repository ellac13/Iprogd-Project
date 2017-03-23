// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
phisancaApp.factory('Weather',function ($resource,$cookies) {

    var model = this;

    this.testGeolocation = function() {
        geocoder = new google.maps.Geocoder();
        request = [];
        address = "Vallentuna";
        latlng = {lat: 59.537101, lng: 18.089940};59.537101, 18.089940
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

    this.testGeolocation();

    // Angular service needs to return an object that has all the
    // methods created in it. You can consider that this is instead
    // of calling var model = new DinnerModel() we did in the previous labs
    // This is because Angular takes care of creating it when needed.
    return this;

});