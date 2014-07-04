$(document).ready(function(){

	$(document).on('click','a.verify', function(){
		var items = $('li.active');
		for(var i=0; i<items.length; i++){
			if(items[i].getAttribute("data-slide-to")==0){
				location.href = "../photo/mobile_photo_view01.html";
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
});

//페이지 내에서 <a> 태그 다 가져오기
