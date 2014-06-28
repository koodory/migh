var currPageNo = 1;
var pageSize = 5;
var content = $('#contentBox');
var member; 
var level;
	
$(document).ready(function(){
	getInfo();
//	$('#prevPage').click(function(event){
//		if(currPageNo > 1) loadNoticeList(currPageNo-1);
//	});
//	
//	$('#nextPage').click(function(event){
//		loadNoticeList(currPageNo + 1);
//	});
//	loadNoticeList(currPageNo);
});	

function getInfo(){
  var contextPath = bit.getContextRootPath(); 
  $.getJSON(contextPath + '/qna/getLoginInfo.ajax', 
	function(jsonObj) {
	  var result = jsonObj.ajaxResult;
	  var info = result.data;
	  if (result.status == "ok" && info.no != null && info.level != null){
	    member = info.no; 		
		level = info.level;
		console.log("멤머",member);
		console.log("등급",level);	  
		} else {
		  alert("로그인 하지 않았습니다.");
		  location.href  = contextPath + "/auth/login.html";
		}
	});
}

function pageControl(count){
	var navStrA = 'ui-grid-a', navStrB = 'ui-grid-b';
	var uiStrA = 'ui-block-a', uiStrB = 'ui-block-b', uiStrC = 'ui-block-c';
	var countCheck = count - currPageNo * 5;
	var prev = $('#prev'), home = $('#home'), next = $('#next');
	var nav  = $('#navUl'), ul = $('#ul');

	if(currPageNo == 1){
		prev.css('display','none');
		home.removeClass(uiStrB).addClass(uiStrA);
		next.removeClass(uiStrC).addClass(uiStrB);
		nav.removeClass().addClass(navStrA).trigger('create');
	}else if(countCheck < 0){
		prev.removeClass().addClass(uiStrA);
		home.removeClass().addClass(uiStrB);
		next.css('display','none');
		nav.removeClass().addClass(navStrA).trigger('create');
	}else{
		prev.css('display','block').removeClass().addClass(uiStrA);
		home.removeClass().addClass(uiStrB);
		next.css('display','block').removeClass().addClass(uiStrC);
		nav.removeClass().addClass(navStrB).trigger('create');
	}
}

function pageCreate(data, number){
	if(check_level =='NORMAL'){
  var str = number == 0 ? 'false' : 'true';
  $("<div>")
    .attr("data-role","collapsible").attr("data-collapsed",str)
    .addClass('dataRow')
	.append($('<h1>' + data.title + '</h1>'))
	.append(data.question)
	.appendTo(content);  
  $('div[data-role=content]').trigger('create');// 주입한 객체의 부모에 trigger 사용
	}
}
 
function errorPage(number){
	if(number == 0)  str = '통신 오류!';
	else if(number == 1) str = '데이터를 더이상 가져올 수 없습니다.';
	else if(number == 2) str = '마지막 페이지입니다.'
    $('.errorMsg').remove();
	$('<div>')
	.addClass('errorMsg center')
	.append($('<h2>' + str + '</h2>'))
	.appendTo(question);
	$('div[data-role=content]').trigger('create'); 
}

function loadNoticeList(pageNo){
  $.ajax(bit.contextRoot + '/notice/list.ajax?pageNo=' + pageNo + '&pageSize=' 
		 + pageSize, {
	type: 'POST',
	dataType: 'json', 
	success: function(jsonObj){
	  var result = jsonObj.ajaxResult;
	  var resultCount = result.data.list.length;
	   if(result.status=='ok' && resultCount > 0){
	   $('.dataRow').remove();
	   $('.errorMsg').remove();
	       count = result.data.count;
		   $.each(result.data, function(index,obj){
			  $.each(obj, function(index,data){
				 if(index ==0)
				   pageCreate(data,0);
				 else
				   pageCreate(data,1);
				 if(resultCount < 5)
					errorPage(2);  
			  });
		   });
			currPageNo = pageNo;
		    pageControl(count);
		    
			$('#currPageNo').text(pageNo);		
	    }else{
	  	  errorPage(1);
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

