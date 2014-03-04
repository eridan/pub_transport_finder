<!doctype html>

<html lang="en">
    <head>
        <title>The Earth Maps!</title>
        <meta charset="utf-8" name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <style type="text/css">
            html { height: 100% }
            body { height: 100%; margin: 0; padding: 0 }
            #map_canvas { height: 40%; margin: 10px; padding: 10px;}
            #map_canvas1 { height: 40%; margin: 10px; padding: 10px;}
        </style>
        
        <!--<script src="js/myLoc.js"></script>-->
        <script type="text/javascript">
            window.onload = displayLocation();
            //window.onload = getMyLocation();

            var lat = 0;
            var longit = 0;

            function getMyLocation() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(displayLocation);
                } else {
                    alert('oops, no geolocation support');
                }
            }

            function displayLocation() {
            //function displayLocation(position) {
            //    var latitude = position.coords.latitude;
            //    var longitude = position.coords.longitude;

                var latitude = 53.3498;
                var longitude = -6.26;

            //    var div = document.getElementById("myLocation");
                            lat = latitude;
                            longit = longitude;
            //    div.innerHTML = "You are at Latitude "+latitude+ ", Longitude: "+longitude;
                            loadScript();
                        }
            // Wait until API is fully loaded, then execute function "initialize""
            function loadScript() {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCUWLNQILG9FY1uHuz0ncQ7sKuUXtS9h9I&libraries=places&sensor=true&callback=initialize";
                document.body.appendChild(script);
            }
        </script>

        <script type="text/javascript">
            var map;
            
            function initialize() {
                var myLatlng = new google.maps.LatLng(lat, longit);
                var finalDest = new google.maps.LatLng(53.372467,-6.331065);

                // map opts
                var myOptions = {
                    zoom: 17,
                    center: myLatlng
                }
                
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                
                displayPlaces(finalDest,'restaurant');
                //loadRoute(myLatlng,finalDest);
                
                // There might not need to display Info Window for the marker
//                var infoStr = 'Lat: '+lat+' Long: '+longit;
//                var infowindow = new google.maps.InfoWindow({
//                    content: infoStr
//                });
                
//                var marker = new google.maps.Marker({
//                    position: myLatlng,
//                    map: map,
//                    title: 'You are here'
//                });
                

                // Instantiate an info window to hold step text.
                //stepDisplay = new google.maps.InfoWindow();
                
                
                // -------------- Listneres ------------------------------
                
                // display info Window for the marker
//                google.maps.event.addListener(marker, 'click', function() {
//                  infowindow.open(map,marker);
//                });
            }
            
            // display Places
            function displayPlaces(myLoc, placeType) {
                var request = {
                    location: myLoc,
                    radius: 500,
                    types: [placeType]
                };
                
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, callback);
            }
            
            function callback(results, status, pagination) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                  return;
                } else {
                  createMarkers(results);
                }
             }
            
            // create Places Markers
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

                    var infoStr = 'Lat: ' + lat + ' Long: ' + longit;
                    var infowindow = new google.maps.InfoWindow({
                        content: infoStr
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });
                    
                    document.getElementById('places').innerHTML += '<li>' + place.name + '</li>';
                    bounds.extend(place.geometry.location);
                }
                    map.fitBounds(bounds);
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
                        var warnings = document.getElementById("warnings_panel");
                        warnings.innerHTML = "" + response.routes[0].warnings + "";
                        directionsDisplay.setDirections(response);
                  }
                });
            }

        </script>
    </head>

    <body>
        <!--<H2>Hello, ${name}. Your location: <div id="myLocation"></div></H2>-->
        <!--<br />-->
        <div id="map_canvas" style="width:50%; height:50%"></div>
        <p>Result: <div id="warnings_panel"></div></p>
    <ul id="places"></ul>
    </body>
</html>
