var contextPath = bit.contextRoot; 

$(function(){
	$.getJSON(
			contextPath + '/auth/getLoginUser.ajax', 
			function(jsonObj) {
				var result = jsonObj.ajaxResult;
				if (result.status == "ok") {
					var user = result.data;
					console.log(result.data);
					loginUser = user.name;
					$('#loginUsername').text(user.name + '님 환영합니다.');
				}
			});
});

function logOut(){
	$.getJSON(contextPath + '/auth/logout.ajax', 
			function(jsonObj) {
		var result = jsonObj.ajaxResult;
		console.log(result);
		location.href = contextPath + "/auth/login.html";
	});
}