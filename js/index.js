var map;
var routesQltyAverageAirValues = [];
var isAverageAlreadyAddedToRoutes = false;

var closerMargin = { value: 10, color:"RED"};
var mediumMargin = { value: 48, color:"YELLOW"};
var higherMargin = { value: 50, color:"GREEN"};
var lineWeight = 11; //Route line weight
var polilynes = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: {lat: 23.69, lng: 120.96}
	});

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer({
		map: map,
		panel: document.getElementById('panel-routes')
		//polylineOptions: { strokeColor: 'red' }
	});

	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);
	var transitLayer = new google.maps.TransitLayer();
	transitLayer.setMap(map);
	var bikeLayer = new google.maps.BicyclingLayer();
	bikeLayer.setMap(map);
	directionsDisplay.setMap(map);

	document.getElementById('submit').addEventListener('click', function() {
		calculateAndDisplayRoute(directionsService, directionsDisplay,document.getElementById('txtFromId').value,document.getElementById('txtToId').value);
	});

	directionsDisplay.addListener('directions_changed', function() {
	});

	var inputFrom = document.getElementById('txtFromId');
	var inputTo = document.getElementById('txtToId');
	var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
	var autocompleteTo = new google.maps.places.Autocomplete(inputTo);

	google.maps.event.addListener(map, 'idle', function() {
		var root = document.getElementById("panel-routes").getElementsByTagName('div');
		if(root.length != 0 && !isAverageAlreadyAddedToRoutes){
			var div1 = root[0];
			var div2 = div1.getElementsByTagName('div')[0];
			var table = div2.getElementsByTagName('table')[0];
			var tbody = div2.getElementsByTagName('tbody')[0];
			var trs = div2.getElementsByTagName('tr');
			if(trs.length != 0){
				for(var x = 1; x<trs.length;x++){
					var span = trs[x].getElementsByTagName('span')[0];
					var bold = span.getElementsByTagName('b');
					if(bold.length != 0){
						for(var y = 1; y<bold.length;y++)
							bold[y].innerHTML = "";
					}
					span.innerHTML += " <b>Average quality air: " + Math.round(routesQltyAverageAirValues[x-1] * 100) / 100 + "</b>";
				}
			} else {
				var ol = div2.getElementsByTagName('ol');
				if(ol.length != 0){
					var ls = ol[0].getElementsByTagName('li');
					for(var x = 0; x<ls.length;x++){
						var div3 = ls[x].getElementsByTagName('div')[2];
						//var span = div3.getElementsByTagName('span')[2];
						var bold = div3.getElementsByTagName('b');
						if(bold.length != 0){
							for(var y = 0; y<bold.length;y++)
								bold[y].innerHTML = "";
						}
						div3.innerHTML += " <b><br>Average quality air: " + Math.round(routesQltyAverageAirValues[x] * 100) / 100 + "</b>";
				}
			}

			isAverageAlreadyAddedToRoutes = true;
		}
	}});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, from, to) {
	var selectedMode = document.getElementById('media').value;
	var request = {
		origin:from,
		destination:to,
		travelMode: google.maps.TravelMode[selectedMode],
		provideRouteAlternatives: true
	};
	directionsService.route(request, function(result, status) {
		if (status === 'OK') {
			isAverageAlreadyAddedToRoutes = false;
			calculateAverageAndSetColorRoutes(result);
			directionsDisplay.setDirections(result);
		} else {
			alert("No hay resultados");
		}
	});
}

function calculateAverageAndSetColorRoutes(result) {
	cleanPolylinesAndAirAverages();
	for(var routePos = 0; routePos<result.routes.length; routePos++){
		var currentRouteArray = result.routes[routePos];
		var currentRoute = currentRouteArray.overview_path;
		var sumAirValues = 0;
		var cantAirValues = 0;

		var previous = {};
		for (var x = 0; x < currentRoute.length; x++) {
			var pos = new google.maps.LatLng(currentRoute[x].lat(), currentRoute[x].lng());
			var lat = currentRoute[x].lat();
			var lng = currentRoute[x].lng();
			var point = NearestAirPointValue(lat,lng);
			if(previous != {} && (point.gps_lat != previous.gps_lat || point.gps_lon != previous.gps_lon)){
				console.log("NEW AIR API POINT CLOSER TO ROUTE: ", point.s_d0, point);
				sumAirValues = sumAirValues + point.s_d0;
				cantAirValues++;
			}
			previous = point;
		}
		manageRoutesColor(sumAirValues,cantAirValues, result.routes[routePos], routePos);
	}
}


function manageRoutesColor(sumAirValues,cantAirValues, route,routePos){
	var average = sumAirValues/cantAirValues;
	routesQltyAverageAirValues[routePos] = average;

	console.log("SUM:",sumAirValues);
	console.log("CANT:",cantAirValues);
	console.log("AVERAGE:",average);

	if (average < closerMargin.value) {
		paintRoute(closerMargin.color, route);
	} else if(average < mediumMargin.value){
		paintRoute(mediumMargin.color, route);
	} else{
		paintRoute(higherMargin.color, route);
	}
}

function paintRoute(color, route){
	var polyline = new google.maps.Polyline({
		path: [],
		strokeColor: color,
		strokeWeight: lineWeight
	});
	var bounds = new google.maps.LatLngBounds();

	var legs = route.legs;
	for (i = 0; i < legs.length; i++) {
		var steps = legs[i].steps;
		for (j = 0; j < steps.length; j++) {
			var nextSegment = steps[j].path;
			for (k = 0; k < nextSegment.length; k++) {
				polyline.getPath().push(nextSegment[k]);
				bounds.extend(nextSegment[k]);
			}
		}
	}
	polyline.setMap(map);
	polilynes.push(polyline);
}

function cleanPolylinesAndAirAverages(){
	var routesQltyAverageAirValues = [];
	for(var x = 0; x< polilynes.length; x++){
		polilynes[x].setMap(null);
	}
	polilynes= [];
}
