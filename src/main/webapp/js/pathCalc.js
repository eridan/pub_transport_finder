var map, placesList;
var myLatLong;

function initialize() {
//    drawMap();
//    setMyCurrentLoc();
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
    };

    FunctionOne().done(FunctionTwo);

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
        createMarkers(results);

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
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        placesList.innerHTML += '<li>' + place.name + '</li>';

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
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