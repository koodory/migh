var userId, userName, userLv, userNo;
var contextPath = bit.getContextRootPath();
var date = new Date();
var month = date.getMonth()+1;
if(month  < 10){ month = '0' + month;}
var user = {}
var currDate = date.getFullYear() + '-' + month + '-' + date.getDate();

//돔트리 완성 후 함수 실행
$(document).ready(function(){
	getInfo();
	write();
});	

//세션에서 필요한 유저 정보 가져오기
function getInfo(){
	$.getJSON(
		contextPath + '/auth/getLoginUser.ajax', 
		function(jsonObj) {
			var result = jsonObj.ajaxResult;
			if (result.status == "ok") {
				console.log("session에 담긴 정보");
				console.log(result.data);
				$.each(obj,function(index, items){
					if(index != null && items != null)
	                   user[index] = items;
				});
				$('<span>').text("작성자 : " + userName).appendTo($('#name'));
			}
	});
}

//쓰기
function write(){
	$('#btnRegist').on('click', function(event){
		event.preventDefault();

		$.ajax(bit.contextRoot + '/photos/insert.ajax', {
			type: 'POST',
			dataType: 'json', 
			data: { 
//				contentType:'multipart/form-data',
				memberNo: $('#memberNo').val(),
				photosTitle: $('#photosTitle').val(),
				photosContent: $('#photosContent').val(),
				photosImg: $('#file1').attr('files')
			},
			success: function(jsonObj){
				var result = jsonObj.ajaxResult;
				setTimeout(function(){
					location.href  = contextPath + "/photo/mobile_photo01.html"
					}, 1000);			},
			error: function(xhr, ajaxOptions, thrownError){
				alert("통신 장애");
				console.log(xhr.status);
				console.log(thrownError);
			}
		});
	});

}


