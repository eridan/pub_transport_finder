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
            function initialize() {
                var myOptions = {
                    zoom: 18,
                    center: new google.maps.LatLng(lat, longit),
                    mapTypeId: google.maps.MapTypeId.HYBRID
                }
                
                var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
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
    </body>
</html>
