var userId, userName, userLv, userNo;
var contextPath = bit.getContextRootPath();
var date = new Date();
var month = date.getMonth()+1;
if(month  < 10){ month = '0' + month;}
var user = {};
var currDate = date.getFullYear() + '-' + month + '-' + date.getDate();
var formData;

//돔트리 완성 후 함수 실행
$(document).ready(function(){
	getInfo();
});	

//세션에서 필요한 유저 정보 가져오기
function getInfo(){
	$.getJSON(
			contextPath + '/auth/getLoginUser.ajax', 
			function(jsonObj) {
				var result = jsonObj.ajaxResult;
				if (result.status == "ok") {
					userNo = result.data.no;
					$('<span>').text("작성자 : " + result.data.name).appendTo($('#name'));
					$('<span>').text(currDate).appendTo("#currTime");
					$('#memberNo').val(userNo);
				}
			});
}

// alarm
function alarm(){
	$('#alarm').contents().remove();
	$('#alarm').addClass("label-alarm red")
	.append("제목, 사진, 내용은 필수 입력값입니다.");
}

//form data 전송
$("#multiform").on("submit",function(e){
	e.preventDefault();
	// 유효값 검증
	if($("#photosTitle").val() == (null||"") ||
			$("#photosContent").val() == (null||"")||
			$("#photoFile").val() == (null||"")){
		return alarm();
	}
	
	// mime type으로 전환해서 data 보내기전에 변수화 해서 담기
	var formObj = $(this);
	var formURL = formObj.attr("action");
	formData = new FormData(this);
	
	$.ajax(formURL,{
		type: "POST",
		data: formData,
		mimeType:"multipart/form-data",
		contentType: false,
		cache: false,
		processData:false,
		success: function(data, textStatus, jqXHR)
		{
			// 등록 성공시 알람, 1초 후 리스트로 이동.
			$('#alarm').contents().remove();
			$('#alarm').addClass("label-alarm red")
			.append("등록이 정상적으로 되었습니다.")
			.append("잠시후 리스트로 이동합니다.");
			setTimeout(function(){
				location.href  = contextPath + "/photo/mobile_photo.html"
			}, 1000);
		},
		error: function(jqXHR, textStatus, errorThrown) 
		{
			console.log(textStatus);
			console.log(errorThrown);
		} 	        
	});
});
