var userId, userName, userLv, userNo;
var contextPath = bit.getContextRootPath();
var date = new Date();
var month = date.getMonth()+1;
if(month  < 10){ month = '0' + month;}
var user = {}
var currDate = date.getFullYear() + '-' + month + '-' + date.getDate();

//돔트리 완성 후 함수 실행
$(document).ready(function(){
	$("<span>").css("border","red solid 1px").text(currDate).appendTo("#currTime");
	getInfo();
	write();
//	$('#btnRegist').on('click', function(event){
//		$("#multiform").submit();
//	}
	
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

//Callback handler for form submit event
//$("#multiform").submit(function(e)
//{
// 
//    var formObj = $(this);
//    var formURL = formObj.attr("action");
//    var formData = new FormData(this);
//    $.ajax({
//        url: formURL,
//    type: 'POST',
//        data:  formData,
//    mimeType:"multipart/form-data",
//    contentType: false,
//        cache: false,
//        processData:false,
//    success: function(data, textStatus, jqXHR)
//    {
//    	setTimeout(function(){
//			location.href  = contextPath + "/photo/mobile_photo.html"
//			}, 50);	
// 
//    },
//     error: function(jqXHR, textStatus, errorThrown) 
//     {
//     }          
//    });
//    e.preventDefault(); //Prevent Default action. 
//    e.unbind();
//}); 
//$("#multiform").submit(); //Submit the form

//쓰기
function write(){
	$('#btnRegist').on('click', function(event){
		event.preventDefault();

		$.ajax(bit.contextRoot + '/photo/insert.ajax', {
			type: 'POST',
			dataType: 'json', 
			data: { 
				memberNo: $('#memberNo').val(),
				photosTitle: $('#photosTitle').val(),
				photosContent: $('#photosContent').val(),
				photosImg: $('#photoFile').attr('files')
			},
			success: function(jsonObj){
				setTimeout(function(){
					location.href  = contextPath + "/photo/mobile_photo.html"
					}, 1000);			},
			error: function(xhr, ajaxOptions, thrownError){
				alert("통신 장애");
				console.log(xhr.status);
				console.log(thrownError);
			}
		});
	});

}
