var contextPath = bit.getContextRootPath(); 

function deleteCookie(c_name) {
	  document.cookie = encodeURIComponent(c_name) 
	  + "=deleted; expires=" + new Date(0).toUTCString();
}

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
		document.cookie="JSESSIONID=123;Path=/managerconsole;"
		deleteCookie("JSESSIONID");
		location.href = contextPath + "/auth/login.html";
	});
}