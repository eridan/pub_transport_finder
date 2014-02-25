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
        
        <script src="js/myLoc.js"></script>

        <script type="text/javascript">
            var map;
            var directionsDisplay;
            var directionsService;
            var stepDisplay;
            var markerArray = [];
            
            function initialize() {
                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer();
                var myLatlng = new google.maps.LatLng(lat, longit);
                var finalDest = new google.maps.LatLng(53.372467,-6.331065);

                // map opts
                var myOptions = {
                    zoom: 17,
                    center: myLatlng
                    
                    // Simple map view to reduce the internet traffic
                    //mapTypeId: google.maps.MapTypeId.HYBRID
                }
                
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                directionsDisplay.setMap(map);
                
                // There might not need to display Info Window for the marker
                var infoStr = 'Lat: '+lat+' Long: '+longit;
                var infowindow = new google.maps.InfoWindow({
                    content: infoStr
                });
                
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: 'You are here'
                });
                
                var request = {
                    origin:myLatlng,
                    destination:finalDest,
                    travelMode: google.maps.TravelMode.WALKING}; // DRIVING
                
                directionsService.route(request, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        var warnings = document.getElementById("warnings_panel");
                        warnings.innerHTML = "" + response.routes[0].warnings + "";
                        directionsDisplay.setDirections(response);
                        showSteps(response);

                  }
                });

                // Instantiate an info window to hold step text.
                stepDisplay = new google.maps.InfoWindow();
                
                
                // -------------- Listneres ------------------------------
                
                // display info Window for the marker
                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.open(map,marker);
                });
            }
            
            
            function showSteps(directionResult) {
            // For each step, place a marker, and add the text to the marker's
            // info window. Also attach the marker to an array so we
            // can keep track of it and remove it when calculating new
            // routes.
            var myRoute = directionResult.routes[0].legs[0];
            console.log("Distance: "+myRoute.distance.text);
            console.log("Duration: "+myRoute.duration.text);

            for (var i = 0; i < myRoute.steps.length; i++) {
                var marker = new google.maps.Marker({
                  position: myRoute.steps[i].start_point,
                  map: map
                });
                attachInstructionText(marker, myRoute.steps[i].instructions);
                markerArray[i] = marker;
            }
          }

          function attachInstructionText(marker, text) {
            google.maps.event.addListener(marker, 'click', function() {
              stepDisplay.setContent(text);
              stepDisplay.open(map, marker);
            });
          }
            
            

            // Wait until API is fully loaded, then execute function "initialize""
            function loadScript() {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCUWLNQILG9FY1uHuz0ncQ7sKuUXtS9h9I&sensor=true&callback=initialize";
                document.body.appendChild(script);
            }
        </script>
    </head>

    <body>
        <H2>Hello, ${name}. Your location: <div id="myLocation"></div></H2>
        <br />
        <div id="map_canvas" style="width:50%; height:50%"></div>
        <p>Result: <div id="warnings_panel"></div></p>
    </body>
</html>
