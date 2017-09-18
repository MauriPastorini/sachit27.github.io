
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
function UserAction() {
    var xhttp = new XMLHttpRequest();
    xhttp.open( "POST", "https://pm25.lass.net/data/last-all-airbox.json", false );
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    var response = JSON.parse( xhttp.responseText );

    for( var i = 0 ; i = response[ "feeds" ].length ; i++ )
    {
        console.log( r[ "feeds" ][ i ][ s_d0 ] );
    }
}
