  function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
          map: map,
          panel: document.getElementById('right-panel')
        });

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: {lat: 23.69, lng: 120.96}
        });
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        var transitLayer = new google.maps.TransitLayer();
        transitLayer.setMap(map);
        directionsDisplay.setMap(map);
        document.getElementById('submit').addEventListener('click', function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        });
      }

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
           var selectedMode = document.getElementById('mode').value;
        var waypts = [];
        var checkboxArray = document.getElementById('waypoints');
        for (var i = 0; i < checkboxArray.length; i++) {
          if (checkboxArray.options[i].selected) {
            waypts.push({
              location: checkboxArray[i].value,
              stopover: true
            });
          }
        }

        directionsService.route({
          origin: document.getElementById('start2').value,
          destination: document.getElementById('end2').value,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
              var routeSegment = i + 1;
              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                  '</b><br>';
              summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
              summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
              summaryPanel.innerHTML += route.legs[i].duration.text + '<br>';
              summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                summaryPanel.innerHTML += "Particles  (PM2.5)." + " " + Math.floor((Math.random() * 100) + 1)+'<br><br>';
                summaryPanel.innerHTML += "ozone  ." + " " + Math.floor((Math.random() * 100) + 1)+15 +'<br><br>';
                  summaryPanel.innerHTML += "Air Quality Index (AQI)" + " " + Math.floor((Math.random() * 100) + 1) +'<br><br>';
            }
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAogXCFYpylx0oKNcTJEQgaWFoHdk-TqqE&callback=initMap">
    </script>
