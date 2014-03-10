<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/styles.css">
        <title>Place search pagination</title>
        <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
        <!--<script src="js/jquery-1.11.0.min.js"></script>-->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCUWLNQILG9FY1uHuz0ncQ7sKuUXtS9h9I&libraries=places&sensor=true"></script>
        <script src="js/pathCalc.js"></script>
    </head>
    <body>
        <div id="map-canvas"></div>
        <div id="results">
            <h2>Results</h2>
            <ul id="places"></ul>
            <button id="more">More results</button>
        </div>
    </body>
</html>

