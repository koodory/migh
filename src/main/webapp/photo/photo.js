var contextPath = bit.getContextRootPath();
var date = new Date();
var month = date.getMonth()+1;
if(month  < 10){ month = '0' + month;}
var user = {}
var currDate = date.getFullYear() + '-' + month + '-' + date.getDate();

$(document).ready(function(){

	$(document).on('click','a.verify', function(){
		var items = $('li.active');
		for(var i=0; i<items.length; i++){
			if(items[i].getAttribute("data-slide-to")==0){
				location.href = "#photo-detail-view";
			}else if (items[i].getAttribute("data-slide-to")==1){
				location.href = "../photo/mobile_photo_view02.html";
			}else if(items[i].getAttribute("data-slide-to")==2){
				location.href = "../photo/mobile_photo_view03.html";
			}
		}
		return false;
	});
	
	$("#myCarousel").swiperight(function() {
	      $("#myCarousel").carousel('prev');
	 });
	$("#myCarousel").swipeleft(function() {
	      $("#myCarousel").carousel('next');
	 });
	   
	getInfo();
//	write();
});


//세션에서 필요한 유저 정보 가져오기
function getInfo(){
	$.getJSON(
		contextPath + '/auth/getLoginUser.ajax', 
		function(jsonObj) {
			var result = jsonObj.ajaxResult;
			if (result.status == "ok") {
				$.each(result.data, function(index, items){
					if(index != null && items != null)
	                   user[index] = items;
				});
				$("#memberNo").val(user.no);
			}
	});
}

//쓰기
//function write(){
//	$('#btnRegist').on('click', function(event){
//		event.preventDefault();
//
//		$.ajax(bit.contextRoot + '/photos/insert.ajax', {
//			type: 'POST',
//			dataType: 'json', 
//			data: { 
////				contentType:'multipart/form-data',
//				memberNo: $('#memberNo').val(),
//				photosTitle: $('#photosTitle').val(),
//				photosContent: $('#photosContent').val(),
//				photosImg: $('#file1').attr('files')
//			},
//			success: function(jsonObj){
//				var result = jsonObj.ajaxResult;
//				setTimeout(function(){
//					location.href  = contextPath + "/photo/mobile_photo01.html"
//					}, 1000);			},
//			error: function(xhr, ajaxOptions, thrownError){
//				alert("통신 장애");
//				console.log(xhr.status);
//				console.log(thrownError);
//			}
//		});
//	});
//
//}



//페이지 내에서 <a> 태그 다 가져오기
