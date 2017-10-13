var from = null;
var to = null;
var distancia_entre_coordenadas = 0.1;
var margen_para_matriz_entre_dos_puntos= 1;
var margen_de_cada_lado = margen_para_matriz_entre_dos_puntos/2

var from_lat, from_lng, to_lat,to_lng;

function test(){
  from_lat = 100;
  from_lng = 100;
  to_lng = 101;
  to_lat = 99;

}

function manageIncomingRoutes(location, fromOrTo){
  if(fromOrTo == "from"){
    from = location;
  } else if (fromOrTo == "to") {
    to  = location;
  } else {
    from = to = {};
  }
  if(from != null && to != null){
    startAlgorithmBestRoute();
    from == to == null;
  }
};

function startAlgorithmBestRoute(){
  test();
  // First step
  var mat = createMatrix();
  // Second step
  mat = setWeightsToMap(mat);
  // Third step
  var res = calculateBestRoute(mat);
  // Four step
  var resCoordinates = castArrPosToArrCoordinates(res);
  // Five step
  paintMyBestRoute(resCoordinates, getMap());
}

//First step
function createMatrix(){
  var rows = Math.abs(from_lng - to_lng)/distancia_entre_coordenadas + margen_para_matriz_entre_dos_puntos/distancia_entre_coordenadas;
  rows = Math.ceil(rows);
  var cols = Math.abs(from_lat - to_lng)/distancia_entre_coordenadas + margen_para_matriz_entre_dos_puntos/distancia_entre_coordenadas;
  cols = Math.ceil(cols);
  var mat = new Array(rows);
  for (var i = 0; i < rows; i++) {
    mat[i] = new Array(cols);
  }
  console.log('mat', mat);
  return mat;
}

//Second step
function setWeightsToMap(mat){
  var min = Math.min(from_lng,to_lng);
  var max = Math.max(from_lat,to_lat);

  for(var i = 0; i < mat.length ; i++ ){
    for(var j = 0; j < mat[i].length ; j++){
      var lng = min - margen_de_cada_lado + j * distancia_entre_coordenadas;
      var lat = max - margen_de_cada_lado + i * distancia_entre_coordenadas;
      console.log("i",i);
      console.log("j",j);
      console.log("lng",lng);
      console.log("lat",lat);
      var nearPoint = NearestAirPointValue(lat,lng).s_d0;
      mat[i][j] = nearPoint;
    }
  }
  console.log(mat);
  return mat;
}

  //Third step
  function calculateBestRoute(mat){
    var min = Math.min(from_lng,to_lng);
    var max = Math.max(from_lat,to_lat);

    var graphRoutes = new Graph(mat, {diagonal: true});

    var jS = (from_lng - min + margen_de_cada_lado)/distancia_entre_coordenadas;
    var iS = (from_lat - max + margen_de_cada_lado)/distancia_entre_coordenadas;

    var start = graphRoutes.grid[iS][jS];

    var jF = (to_lng - min + margen_de_cada_lado)/distancia_entre_coordenadas;
    var iF = (to_lat - max + margen_de_cada_lado)/distancia_entre_coordenadas;

    var end = graphRoutes.grid[iF][jF];
		var result = astar.search(graphRoutes, start, end,{ heuristic: astar.heuristics.diagonal });
    return result
  }

  //Four step
  function castArrPosToArrCoordinates(arr){
    var min = Math.min(from_lng,to_lng);
    var max = Math.max(from_lat,to_lat);

    var arrCoord = new Array(arr.length + 2);
    arrCoord[0] = {"lat":from_lat,"lng":from_lng};

    for(var pos = 0; pos < arr.length ; pos++ ){
      var i = arr[pos].x;
      var j = arr[pos].y;
      var lng = min - margen_de_cada_lado + j * distancia_entre_coordenadas;
      var lat = max - margen_de_cada_lado + i * distancia_entre_coordenadas;
      arrCoord[pos+1] = {"lat":lat,"lng":lng};
    }
    arrCoord[arrCoord.length - 1] = {"lat":to_lat,"lng":to_lng};
  }

  //Five step
  function draw(arrCoord, map){
     var bestAirApiPath = new google.maps.Polyline({
       path: arrCoord,
       geodesic: true,
       strokeColor: '#FF0000',
       strokeOpacity: 1.0,
       strokeWeight: 2
     });

     bestAirApiPath.setMap(map);
  }
