
// shttp get request to server 
// function httpGetAsync( URL, callback )
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", URL, true); // true for asynchronous 
//     xmlHttp.send(null);
// }
// getting json data 
function ProcessRequest() 
{
	if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) 
	{
		if ( xmlHttp.responseText == "Not found" ) 
		{
			document.getElementById( "TextBoxCustomerName"    ).value = "Not found";
			document.getElementById( "TextBoxCustomerAddress" ).value = "";
		}
		else
		{
			var info = eval ( "(" + xmlHttp.responseText + ")" );

			// No parsing necessary with JSON!        
			document.getElementById( "TextBoxCustomerName"    ).value = info.jsonData[ 0 ].cmname;
			document.getElementById( "TextBoxCustomerAddress" ).value = info.jsonData[ 0 ].cmaddr1;
		}                    
	}
}

// posting json data into DOM  
// function UserAction() {
// 	var xhttp = new XMLHttpRequest();
// 	xhttp.open( "POST", "https://pm25.lass-net.org/data/last-all-airbox.json", false );
// 	xhttp.setRequestHeader("Content-type", "application/json");
// 	xhttp.send();
// 	var response = JSON.parse( xhttp.responseText );

// 	for( var i = 0 ; i = response[ "feeds" ].length ; i++ )
// 	{
// 		console.log( r[ "feeds" ][ i ][ s_d0 ] );
// 	}
// }

function UserAction() {
	// var xhttp = new XMLHttpRequest();
	// xhttp.open( "POST", "https://pm25.lass-net.org/data/last-all-airbox.json", false );
	// xhttp.setRequestHeader("Content-type", "application/json");
	// xhttp.send();

	var url = "https://pm25.lass-net.org/data/last-all-airbox.json";
	var xhr = createCORSRequest( 'POST', url );
	if( !xhr )
	{
		throw new Error( 'CORS not supported' );
	} else {
		var response = JSON.parse( xhr.responseText );
		for( var i = 0 ; i = response[ "feeds" ].length ; i++ )
		{
			console.log( r[ "feeds" ][ i ][ s_d0 ] );
		}
	}
}

function createCORSRequest( method, url )
{
	var xhr = new XMLHttpRequest();
	if ( "withCredentials" in xhr )
	{
		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open( method, url, true );

	}
	else if( typeof XDomainRequest != "undefined" )
	{
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open( method, url );

	}
	else
	{
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}
	return xhr;
}
