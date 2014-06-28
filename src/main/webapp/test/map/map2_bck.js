var geocoder;
var map;

function initialize(lat,lng){
	geocoder = new google.maps.Geocoder();
	var latlng = new google.mapsLatLng(lat,lng);
	var myOptions = {
			zoom: 15,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.HYBRID
	};

	map = new google.maps.Map(document.getElementById("map_canvase"), myOptions);

	$('.page-map').live("pagecreate", function(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				initalize(position.coords.latitude, position.coords.longitude);

				if(geocoder){
					var address="경기도 안산시 단원구 원곡1동 931번지 중소기업연구원";
					geocoder.geocode({'address':address}, function(results,status){
						if(status == google.maps.GeocoderStatus.OK){
							map.setCenter(results[0].geometry.location);
							var marker = new google.maps.Marker({
								map:map,
								position:results[0].geometry.location
							});
						}else{
						  alert("Geocode was not successful for the following " +
						  		"resaon" + status);
						}		
					});
				}


			});
		}
	});	
}

function calcRoute() {
	var start = document.getElementById('start').value;
	var selectedMode = document.getElementById('mode').value;
	var request = {
			origin : start,
			destination : end,
			travelMode : google.maps.TravelMode[selectedMode]
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
