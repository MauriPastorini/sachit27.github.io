var map;
var routesQltyAverageAirValues = []; // This array contain the average values for each route after been calculated
var isAverageAlreadyAddedToRoutes = false; // This boolean is for not adding several times the average information to the routes
var polilynes = [];

/**
 * This are parametrical values that you can change for your bussiness.
 */
var closerMargin = { value: 10, color:"RED"};
var mediumMargin = { value: 48, color:"YELLOW"};
var higherMargin = { value: 50, color:"GREEN"};
var lineWeight = 11; //Route line weight

/**
 * This method is called when Google maps script called the Google Maps Api.
 */
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: {lat: 23.69, lng: 120.96}
	});

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer({
		map: map,
		panel: document.getElementById('panel-routes') //Id where the panel of directions and suggestions will be shown. This panel is builded itself from Google Maps Api
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

	var inputFrom = document.getElementById('txtFromId');
	var inputTo = document.getElementById('txtToId');
	var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
	var autocompleteTo = new google.maps.places.Autocomplete(inputTo);

	/**
	 * This listener is for adding the average to the routes panel. When all the routes are drawn and panel is builded by Google Maps Api, this listener is activated so
	 * it can add the average information to the Html. Maybe it is a bit cofusing, but the fact is that is getting in the html so it can add to the correct tag
	 * the average information.
	 */
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

/**
 * This listener is for adding the average to the routes panel. When all the routes are drawn and panel is builded by Google Maps Api, this listener is activated so
 * it can add the average information to the Html. Maybe it is a bit cofusing, but the fact is that is getting in the html so it can add to the correct tag
 * the average information.
 */
function calculateAndDisplayRoute(directionsService, directionsDisplay, from, to) {
	var selectedMode = document.getElementById('media').value; //This The travel Mode
	var request = {
		origin:from,
		destination:to,
		travelMode: google.maps.TravelMode[selectedMode],
		provideRouteAlternatives: true
	};
	directionsService.route(request, function(result, status) {
		if (status === 'OK') {
			isAverageAlreadyAddedToRoutes = false;
			calculateAverageAndSetColorRoutes(result); //If it is all OK, this method is going to calculate and paint the routes
			directionsDisplay.setDirections(result);
		} else {
			alert("There is no results");
		}
	});
}

function calculateAverageAndSetColorRoutes(result) {
	cleanPolylinesAndAirAverages();
	for(var routePos = 0; routePos<result.routes.length; routePos++){ //Calculate average and paint route for each route
		var currentRouteArray = result.routes[routePos];
		var currentRoute = currentRouteArray.overview_path;
		var sumAirValues = 0;
		var cantAirValues = 0;

		var previous = {};
		for (var x = 0; x < currentRoute.length; x++) { //For each point in the route
			var pos = new google.maps.LatLng(currentRoute[x].lat(), currentRoute[x].lng()); //Gets the coordinates
			var lat = currentRoute[x].lat();
			var lng = currentRoute[x].lng();
			var point = NearestAirPointValue(lat,lng); //Method that returns the nearest quality air point
			if(previous != {} && (point.gps_lat != previous.gps_lat || point.gps_lon != previous.gps_lon)){ //This condition is for not calculating the same point if it was the same as the previous
				console.log("NEW AIR API POINT CLOSER TO ROUTE: ", point.s_d0, point);
				sumAirValues = sumAirValues + point.s_d0;
				cantAirValues++;
			}
			previous = point;
		}
		manageRoutesColor(sumAirValues,cantAirValues, result.routes[routePos], routePos); //This method will calculate average and paint routes
	}
}


function manageRoutesColor(sumAirValues,cantAirValues, route,routePos){
	var average = sumAirValues/cantAirValues;
	routesQltyAverageAirValues[routePos] = average;

	console.log("SUM:",sumAirValues);
	console.log("CANT:",cantAirValues);
	console.log("AVERAGE:",average);

	//This conditions are for painting the routes with the color that was parametrized in the top of this file
	if (average < closerMargin.value) {
		paintRoute(closerMargin.color, route);
	} else if(average < mediumMargin.value){
		paintRoute(mediumMargin.color, route);
	} else{
		paintRoute(higherMargin.color, route);
	}
}
/**
 * This method paints the routes that are called Polylines
 */
function paintRoute(color, route){
	var polyline = new google.maps.Polyline({
		path: [],
		strokeColor: color,
		strokeWeight: lineWeight
	});
	var bounds = new google.maps.LatLngBounds();

	//This code takes the parts of the routes and paints it
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
	polyline.setMap(map); //This set the color routes to the map
	polilynes.push(polyline);
}

/**
 * This method is for clear all the routes and averages array
 */
function cleanPolylinesAndAirAverages(){
	var routesQltyAverageAirValues = [];
	for(var x = 0; x< polilynes.length; x++){
		polilynes[x].setMap(null);
	}
	polilynes= [];
}
