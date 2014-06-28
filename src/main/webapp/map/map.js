var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var start;
var pos;
var end = new google.maps.LatLng(37.29391, 127.202566); //에버렌드

function initialize() {

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude); 
			
//			alert(pos);
//			
	   var infowindow = new google.maps.InfoWindow({
			map: map,
			position: pos,			
			content: '현재 위치'
		});
			if(pos != null){
				map.setCenter(pos);
				start = pos;
			}		
		});
	}

	var mapOptions = {
			zoom : 11,
			center : pos,
			map: map
	}
		
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);

	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directions-panel'));

	var control = document.getElementById('control');
	control.style.display = 'block';
}

function calcRoute() {
	var start = document.getElementById('start').value;
	if($('#start').val() == 'pos'){
		start = pos;
	}
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