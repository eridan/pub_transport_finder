var map, placesList;
var myLatLong, searchResults;

function initialize() {
    var FunctionOne = function() {
        var
        a = $.Deferred(),
        b = $.Deferred();

        // some fake asyc task
        setTimeout(function() {
            console.debug('drawing map');
            drawMap();
            a.resolve();
            console.debug('drawing map. Done');
        }, Math.random() * 4000);

        // some other fake asyc task
        setTimeout(function() {
            console.debug('setting current location');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    myLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    b.resolve();
                });
            } else {
                alert('oops, no geolocation support');
            }
            console.debug('setting current location. Done');
        }, Math.random() * 4000);

        return $.Deferred(function(def) {
            $.when(a, b).done(function() {
                def.resolve();
            });
        });
    };

    var FunctionTwo = function() {
        console.log('Init is completed. Starting with a serious stuff now');
        console.log('I am Serious now ... ');
        console.debug(myLatLong.toSource());
//        var finalDest = new google.maps.LatLng(53.372467,-6.331065);
//        loadRoute(myLatLong,finalDest);
//        createResultMap();
    };

    FunctionOne().done(FunctionTwo);
}

function createResultMap(places) {
    console.debug(places[0].toSource());
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
        placesList.innerHTML += '<li>' + place.name + '</li>';
        createMarker(place.geometry.location,place.name);
        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}

function createMarker(pos, t) {
    var marker = new google.maps.Marker({       
        position: pos, 
        map: map,  // google.maps.Map 
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

function drawMap() {
    var home = new google.maps.LatLng(53.4028352, -6.4072838);
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: home,
        zoom: 17
    });
    var request = {
        location: home,
        radius: 500,
        types: ['store']
    };
    placesList = document.getElementById('places');
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status, pagination) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
        return;
    } else {
        createResultMap(results);
//        createMarkers(results);

        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');
            moreButton.disabled = false;
            google.maps.event.addDomListenerOnce(moreButton, 'click',
                    function() {
                        moreButton.disabled = true;
                        pagination.nextPage();
                    });
        }
    }
}

function createMarkers(places) {
//    var bounds = new google.maps.LatLngBounds();

    var markerList = new Array();
    for (var i = 0, place; place = places[i]; i++) {
//        var image = {
//            url: place.icon,
//            size: new google.maps.Size(71, 71),
//            origin: new google.maps.Point(0, 0),
//            anchor: new google.maps.Point(17, 34),
//            scaledSize: new google.maps.Size(25, 25)
//        };

        var marker = new google.maps.Marker({
            map: map,
//            icon: image,
            title: place.name,
            position: place.geometry.location
        });
        
        markerList.push(marker);
        console.debug(markerList.toSource());
//        placesList.innerHTML += '<li>' + place.name + '</li>';
//        bounds.extend(place.geometry.location);
    }
    
    //addInfoWindow(markList);
//    map.fitBounds(bounds);
}

function addInfoWindow(markList) {
    for(var marker in markList) {
        placesList.innerHTML += '<li>' + marker.getTitle + '</li>';
//        var infowindow = new google.maps.InfoWindow({
//            content: marker.title
//        });
//                
//        // -------------- Listneres ------------------------------
//                
//        // display info Window for the marker
//        google.maps.event.addListener(marker, 'click', function() {
//          infowindow.open(map,marker);
//        });
    }
}

function setMyCurrentLoc() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            myLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        });
    } else {
        alert('oops, no geolocation support');
    }
}

google.maps.event.addDomListener(window, 'load', initialize);