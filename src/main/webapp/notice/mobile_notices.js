var currPageNo = 1;
var pageSize = 10;
var content = $('#contentBox');
var check;
var pageFlag = false;
var pageDownStr = 'ui-btn ui-shadow ui-corner-all ui-icon-arrow-d ui-btn-icon-notext ui-btn-b ui-btn-inline'

loadNoticeList(currPageNo);

$(document).on("scrollstart",function(){
  if($(document).height() > $(window).height())
  {
      if($(window).scrollTop() == $(document).height() - $(window).height()){
    	 loadNoticeList(currPageNo+1);
      }
  }
});

function loadingBar(event){
  if(event ==0){
        $('<div>').addClass('loader center ui-nodisc-icon')
        .append($('<a>').attr('href','#').addClass('ui-disabled')
        .addClass(pageDownStr))
        .appendTo(content);
	$('div[data-role=content]').trigger('create');    
  }else if(event == 1){
	$('.loader').remove();
  }else if(event == 2){
	$('.loader').remove();
	$('<button>').text('처음으로 가기').addClass('top-loader center')
	 .attr("onclick","reset()").appendTo(content);  
	$('div[data-role=content]').trigger('create'); 
  }
}

function reset(){
  $('.dataRow').remove();
  $('.top-loader').remove();
  $('.loader').remove();
  loadNoticeList(1);
} 

/* 컨텐츠 생성 페이지 */
function pageCreate(data, number){
  var str = number == 0 ? 'false' : 'true';
  $("<div>")
    .attr("data-role","collapsible").addClass('dataRow')
    .attr("data-collapsed",str).attr("data-iconpos","right")
    .attr("data-collapsed-icon","carat-d").attr("data-expanded-icon","carat-u")
    .append($('<h1>' + data.title + '</h1>').addClass('title'))
    .append(data.content).appendTo(content);
  $(".title").contents().addClass('text-block');
  $('div[data-role=content]').trigger('create'); // 주입한 객체의 부모에 trigger 사용
}

/* 오류 메세지 출력 */
function errorPage(number){
	if(number == 0) { 
	  str = '통신 오류!'; pageFlag = false;
    }else if(number == 1 && pageFlag == false) {
	  str = '데이터를 더이상 가져올 수 없습니다.'; pageFlag = false;
    }
    $('.errorMsg').remove();
	$('<div>').addClass('errorMsg center').append($('<h2>' + str + '</h2>'))
	          .appendTo(content);
	$('div[data-role=content]').trigger('create'); 
}

/* 공지사항 출력 함수 */
function loadNoticeList(pageNo){
  $.ajax(bit.contextRoot + '/notice/list.ajax?pageNo=' + pageNo + '&pageSize=' 
		 + pageSize, {
	type: 'POST',
	dataType: 'json', 
	success: function(jsonObj){
	  var result = jsonObj.ajaxResult;
	  var resultCount = result.data.list.length;
	   if(result.status=='ok' && resultCount > 0){
	   if(pageNo != 1)
		   loadingBar(0);
	   $('.errorMsg').remove();
	       var count = result.data.count;
		   $.each(result.data, function(index,obj){
			  $.each(obj, function(index,data){
				 if(index ==0 && pageNo ==1){
				   pageCreate(data,0);
				 }else{
				   pageCreate(data,1);
				 }
			  });
		   });
		   currPageNo = pageNo;
		   if(resultCount >= 10){
			loadingBar(0);
		   }else{
			loadingBar(2);
			pageFlag = true;
		   }	
	    }else{
	      if(pageFlag == false) errorPage(1);
	  	  console.log(result.status);
	  	  console.log(jsonObj);
		}
	},
	error: function(xhr, status, errorThrown){
	  errorPage(0);
	  console.log(status);
	  console.log(errorThrown);
	}
});	
}


