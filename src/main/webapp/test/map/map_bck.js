var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var pos;
//var basic = new google.maps.LatLng(34.725309,127.880432);
var end = new google.maps.LatLng(41.850033, -87.6500523);

function initialize() {

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude); 
			alert(pos);
//			var infowindow = new google.maps.InfoWindow({
//			map: map,
//			position: pos,
//			content: '현재 위치'
//			});
//			map.setCenter(pos);
		});
	}

//			var infowindow = new google.maps.InfoWindow({
//			map: map,
//			position: pos,
//			content: '현재 위치'
//		});
//
//		map.setCenter(pos);
//	}, function() {
//		handleNoGeolocation(true);
//	});
//}else {
//	handleNoGeolocation(false);

	if(pos == null){
		pos = new google.maps.LatLng(41.850033, -87.6500523);
		alert("현재좌표: 미국");
	}

	directionsDisplay = new google.maps.DirectionsRenderer();

	var mapOptions = {
			zoom : 11,
			center : pos
	}
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directions-panel'));

	var control = document.getElementById('control');
	control.style.display = 'block';
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
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