var userId, userName, userLv, userNo;
var contextPath = bit.getContextRootPath();
var date = new Date();
var month = date.getMonth()+1;
if(month  < 10){ month = '0' + month;}
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
				console.log(result.data);
				userId = result.data.id;
				userNo = result.data.no;
				userName= result.data.name;
				userLv = result.data.level;
				$('<span>').text("작성자 : " + userName).appendTo($('#name'));
			}
	});
}

//쓰기
function write(){
	$('#leveltype').text('질문 등록');
	$('#btnRegist').on('click', function(event){
		event.preventDefault();
		if ($('#title').val().length == 0 ||
				$('#textarea').val().length == 0) {
			$('#alarm').contents().remove();
			$('#alarm').addClass("label-alarm red")
			.append("제목과 내용은 필수 입력값입니다.");
			return;
		} else{
			$('#alarm').contents().remove();
			$('#alarm').addClass("label-alarm red")
			.append("등록이 정상적으로 되었습니다. 잠시후 리스트로 이동합니다.");
			}
		$.ajax(bit.contextRoot + '/qna/insert.ajax', {
			type: 'POST',
			dataType: 'json', 
			data: { 
				memberNo:userNo,
				title: $('#title').val(),
				question: $('#textarea').val()			
			},
			success: function(jsonObj){
				var result = jsonObj.ajaxResult;
				setTimeout(function(){
					location.href  = contextPath + "/qna/mobile_qna.html"
					}, 1000);			},
			error: function(xhr, ajaxOptions, thrownError){
				alert("통신 장애");
				console.log(xhr.status);
				console.log(thrownError);
			}
		});
	});

}


