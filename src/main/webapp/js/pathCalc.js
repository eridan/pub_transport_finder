var map, placesList;
var myLatLong, searchResults;
var places, placesLLArray = new Array();
var home = new google.maps.LatLng(53.4031145,-6.4214445);


function initialize() {
    console.log('Started…');

    var promise1 = getCurLatLong();
    promise1.done(function() {
        console.log("LatLong is set");
        console.warn(myLatLong);
        
        var promise2 = drawMapFunc();
        promise2.done(function() {
            console.log("Second Msg was shown");
            console.warn(myLatLong);
            theEndFunc();
        });
    });
    

    function getCurLatLong() {
        var deferred = $.Deferred();

        setTimeout(function() {
            setMyCurrentLoc(deferred);
        }, 100);

        return deferred.promise();
    }
    
    function drawMapFunc() {
        var deferred = $.Deferred();

        setTimeout(function() {
            console.log("Drawing the Map");
            drawMap(deferred);
        }, 400);

        return deferred.promise();
    }
} // end of Initialize

function theEndFunc() {
    createResultMap();
//    calculateDistances();
}
    
    
    
    
    
    
//    var FunctionOne = function() {
//        var
//        a = $.Deferred(),
//        b = $.Deferred();
//
//        // some fake asyc task
//        setTimeout(function() {
//            console.debug('drawing map');
//            drawMap(a);
//            console.debug('drawing map. Done');
//        }, Math.random() * 4000);
//
//        // some other fake asyc task
//        setTimeout(function() {
//            console.debug('setting current location');
//            if (navigator.geolocation) {
//                navigator.geolocation.getCurrentPosition(function(position) {
//                    myLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                    b.resolve();
//                });
//            } else {
//                alert('oops, no geolocation support');
//            }
//            console.debug('setting current location. Done');
//        }, Math.random() * 4000);
//
//        return $.Deferred(function(def) {
//            $.when(a, b).done(function() {
//                def.resolve();
//            });
//        });
//    };
//
//    var FunctionTwo = function() {
//        console.log('Init is completed. Starting with a serious stuff now');
//        console.debug(myLatLong.toSource());
//        
//        createResultMap();
//        calculateDistances();
//    };
//
//    FunctionOne().done(FunctionTwo);
//}

function calculateDistances() {
    var service = new google.maps.DistanceMatrixService();
    var shortestDist = 999999;
    var locAddr, finalLatLong;
    
    service.getDistanceMatrix(
            {
                origins: [myLatLong],
                destinations: placesLLArray,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: true,
                avoidTolls: true
            }, function(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            alert('getDistanceMatrix Error was: ' + status);
        } else {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
//    var outputDiv = document.getElementById('outputDiv');
//    outputDiv.innerHTML = '';
//    deleteOverlays();

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
//      addMarker(origins[i], false);
                for (var j = 0; j < results.length; j++) {
//        addMarker(destinations[j], true);
                    if(results[j].distance.value < shortestDist) {
                       shortestDist = results[j].distance.value;
                        console.debug("Setting new distance: "+shortestDist);
                       locAddr = destinations[j];
                        console.debug("Address: "+locAddr);
                        finalLatLong = placesLLArray[j];
                        console.debug("LatLong: "+finalLatLong);
                    }
                    console.debug(origins[i] + ' to ' + destinations[j]
                            + ': ' + results[j].distance.value + ' in '
                            + results[j].duration.text + ' latlong: '+placesLLArray[j]+'<br>');
                }
            }
            console.warn("The closest place to you is: "+locAddr);
            loadRoute(myLatLong,finalLatLong);
//            var geocoder = new google.maps.Geocoder();
//            geocoder.geocode({'address':locAddr},function(results, status) {
//                if(status == google.maps.GeocoderStatus.OK) {
//                    console.warn(results[0].geometry.location);
//                    loadRoute(home,results[0].geometry.location);
//                } else {
//                    alert("Geocode was not successful for the followiing reason: "+status);
//                }
//            });
        }
    });
    
}

function drawMap(a) {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: myLatLong,
        zoom: 17
    });
    var request = {
        location: myLatLong,
        radius: 2200,
        types: ['food'],
//        types: ['restaurant|cafe|bar|bakery|food|grocery_or_supermarket|meal_delivery|meal_takeaway|shopping_mall']
    };
    placesList = document.getElementById('places');
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status, pagination) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            return;
        } else {
            places = results;
            a.resolve();
        }
    });
}

function createResultMap() {
//    alert("Place name: "+places[0].name);
    console.debug(places[0].toSource());
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
        placesLLArray.push(place.geometry.location);
        placesList.innerHTML += '<li>' + place.name + '</li>';
        createMarker(place.geometry.location,place.name);
        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}

function createMarker(pos, t) {
    var marker = new google.maps.Marker({
        position: pos,
        map: map, // google.maps.Map 
        title: t
    });
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
        console.debug("I am marker " + marker.title);
        infowindow.setContent(marker.title);
        infowindow.open(marker.get('map'), marker);
    });
    return marker;
}

// display Route
function loadRoute(originPnt, destPnt) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    var request = {
        origin:originPnt,
        destination:destPnt,
        travelMode: google.maps.TravelMode.WALKING}; // DRIVING

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
//            var warnings = document.getElementById("warnings_panel");
//            warnings.innerHTML = "" + response.routes[0].warnings + "";
//            directionsDisplay.setDirections(response);
      }
    });
}

function setMyCurrentLoc(a) {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            a.resolve();
        });
    } else {
        alert('oops, no geolocation support');
    }
}

google.maps.event.addDomListener(window, 'load', initialize);