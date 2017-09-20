var airElementsData = [];

window.onload = function() {
  httpGetAsync("https://pm25.lass-net.org/data/last-all-airbox.json", loadData);
}

function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function loadData(airData){
  var data = JSON.parse(airData);
  airElementsData = data.feeds;
  console.log("Data Air Api", airElementsData);
}

function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

function NearestAirPointValue(latitude, longitude) {
  if(airElementsData == []){
    alert("Air api data not ready");
    return;
  }
  var mindif = 99999;
  var closest;
  var elementMin;

  for (index = 0; index < airElementsData.length; ++index) {
    var element = airElementsData[index];
    var latAir = element.gps_lat;
    var longAir = element.gps_lon;
    var dif = PythagorasEquirectangular(latitude, longitude, latAir, longAir);
    if (dif < mindif) {
      closest = index;
       elementMin = element;
      mindif = dif;
    }
  }
  // console.log("Latitud y longitud de punto a buscar: ", latitude + " , " + longitude);
  // console.log(elementMin);
  // console.log(elementMin.s_d0);
  // console.log(elementMin.gps_lat);
  // console.log(elementMin.gps_lon);
  // console.log("--------------------");
  // console.log(closest);
  // console.log(airElementsData[closest]);
  // console.log(airElementsData[closest].s_d0);
  // console.log(airElementsData[closest].gps_lat);
  // console.log(airElementsData[closest].gps_lon);
  return elementMin;
}
