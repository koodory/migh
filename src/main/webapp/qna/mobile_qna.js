var date = new Date();
var month = date.getMonth()+1;
    if(month  < 10){ month = '0' + month;}
var currDate = date.getFullYear() + '-' + month + '-' + date.getDate();
var currPageNo = 1,  pageSize = 10;
var content = $('#contentBox'); //Jquery mobile content Div
var pageDownStr = 'ui-btn ui-shadow ui-corner-all ui-icon-arrow-d ui-btn-icon-notext ui-btn-b ui-btn-inline'
var contextPath = bit.getContextRootPath(); //루트 경로 가져오기
var userId; // 사용자 아이디
var userLv; // 사용자 등급  
var userNo; // 사용자 관리번호
var flag = true; // 메뉴 제어 변수 , true: 전체메뉴 , false: 대기글
var pageFlag = false; //페이지 상태, 오류메세지 제어
var count; //Q&A record 갯수 저장
var cntIndex = 1; //페이지 세는 변수

$(document).ready(function(){
	getInfo(); 	/* 서버의 세션에서 사용자 정보 가져옴 */
	getCount(currPageNo);
	setUI();
});

function setUI(){	
		
	var getValue = function(tag, key){
	  	
	  var node =  tag.parent().parent(); //현재 버튼 위치
	  var currPos = (key == 'reg') ? (node.parent().parent()) : (node.parent());
	  var index = currPos.contents(":eq(4)"); // 등록 버튼 생성 위치
		
	  var getElement = function(index1, index2){
		   return currPos.contents(":eq(" + index1 + ")").contents(index2);
		   }	 
		       
       var getDate = function(index, flag){
    	   tempDate = getElement(index, ":last").text();
    	   dateType = (flag == true) ? tempDate : null;
    	   returnDate =  (tempDate.length == 0) ? dateType : tempDate;
    	   return returnDate;
       }
            
   	   var textStr = (key == 'mod') ?
   		  '<textarea>' : '<textarea onfocus="javascript:this.value=\'\';">' ;
       
   	   var no = (key == 'reg') ? getElement(1,":eq(1)") : getElement(1,":eq(0)");
   	 
   	   var getTitle = getElement(0,":last");  
   	   
   	   var getAnswer = (key == 'reg') ?
   		   getElement(4,":eq(1)") : getElement(4,":last");
    	  
       var getQuest = getElement(2,":last");
       
       var idx = getElement(1,":eq(1)").css("border","red solid 1px").text(); 
       
       var createElement = function(element, value){
    	   var newElement = element.parent();
	       element.remove();
           $(textStr).val(value).appendTo(newElement);
           newElement.trigger('create');
           newElement.contents(":last").trigger('keyup');
       }
       
       var list = new Array(); // from 0 --> no, title, question, answer
       
       var setValue = function(){ //문자열값 구하는 함수
           var elements = [no, getTitle, getQuest, getAnswer]; 
           $.each(elements, function(index,value){
        	   if(value.prop('tagName') == 'TEXTAREA'){
        	     list[index] = value.val(); 
        	   }else{
        		 list[index] =  value.text();
        	   }
           });
       }
       
       switch(key){
       case 'reg':  //등록 버튼 클릭
                   setValue(); //node, no, title, question, answer, aDate, qDate
                   updateList(node, list[0], list[1], list[2], list[3], 
            	   getDate(3,false), getDate(1,true)); 
    	           break;
       case 'ans' : //답변 버튼 클릭
    	            setValue();
                    createElement(getAnswer,list[3]);
                    uiRegister(node, index);
    	            break;
       case 'mod' : //수정 버튼 클릭
    	            setValue();
    	            createElement(getTitle, list[1]);
    	            createElement(getQuest, list[2]);
    	            uiRegister(node, index);
    	            break;
       case 'del'  : // 삭제 버튼 클릭 
    	            popup(idx);
    	            break
       }      
	}
	
	/* 등록 버튼 클릭시 */
	$(document).on('click','a.registBtn',function(){
        $('.label-alarm').remove();
        getValue($(this),'reg');
	});	
	/* 답변 버튼 클릭시 */
	$(document).on('click','a.rspBtn', function(){
		getValue($(this),'ans');
	});
    /* 수정 버튼 클릭시 */
	$(document).on('click','a.updateBtn', function(){  
	    getValue($(this),'mod');
	});
    /* 삭제 버튼 클릭시 */
	$(document).on('click','a.deleteBtn', function(){
	    getValue($(this),'del');
	});
    /* 취소 버튼 클릭시 */
	$(document).on('click','a.cancelBtn', function(){
	  reset();
	});
	
	/* 스크롤 제어 */
	$(document).on("scrollstart",function(){
		if($(document).height() > $(window).height())
		{
		  if($(window).scrollTop() == $(document).height() - $(window).height()){
		    loadList(currPageNo+1, pageSize); //맨 하단으로 갈시 loadList를 1증가 시켜 실행
		  } 
		}
	});
	
    /* 전체보기 버튼 클릭시 */
	$('#allBtn').click(function(event){ 
		flag = true;
		btnControl(); reset();
	});
    
	/* 대기글 보기 버튼 클릭시 */
	$('#adminBtn').click(function(event){
		flag = false;
		btnControl(); reset();
	});
	
	/* 데이터 전송 버튼 생성 */
	function uiRegister(currPos, index){
    	currPos.remove();
		$('<div>').addClass('ui-grid-a')
		.append($('<div>').addClass('ui-block-a')
		  .append($('<a>').attr('href','#').attr('data-role','button')
		  .addClass("registBtn").text('등록')))
		  
		 .append($('<div>').addClass('ui-block-b')
		  .append($('<a>').attr('href','#').attr('data-role','button')
				  .addClass("cancelBtn").text('취소')))

		.appendTo(index); //컨텐츠의 마지막 자식 element에만 적용할 것
		index.trigger('create');
	}
	
	/* 팝업 클릭	*/
	function popup(idx) {
		console.log(idx + "팝업창 생성시");
	    // close button
		 var closeBtn = $('<a href="#" data-rel="back" class="ui-btn-right ui-btn ui-btn-b ui-corner-all ui-btn-icon-notext ui-icon-delete ui-shadow">Close</a>');

	     // text you get from Ajax
	     var content = $('<h3>').text('삭제하시겠습니까?').css('margin-top','35px')
	                    .css('margin-bottom','25px')
	                    .addClass('center bold');
	       
	     var btn = $('<div>').addClass("ui-grid-a")
	                .append($('<div>').addClass('ui-block-a')
	                  .append($('<a>')
	                  .attr({'href':'#', 'data-role':'button', 'role':'button',
	                	     'id':'confirm', 'data-rel':"back"})
	                  .addClass('confirm-btn').text('확인')))
	                .append($('<div>').addClass('ui-block-b')  
	                  .append($('<a>')
	    	          .attr({'href':'#', 'data-role':'button', 'role':'button',
	 	                	   'id':'cancel', 'data-rel':"back"}) 		  
	                  .addClass('cancel-btn').text('취소')))
	     
	     // Popup body - set width is optional - append button and Ajax msg
	     var popup = $("<div/>", {
	         "data-role": "popup",     	 
	     }).css({
	         width: $(window).width() / 1.2 + "px",
	         padding: 10 + "px",
	         height: $(window).height() / 3.5  + "px"
	     }).append(closeBtn).append(content).append(btn);
	     // Append it to active page
	     $.mobile.pageContainer.append(popup).css("text-align","center");

	    // Create it and add listener to delete it once it's closed
	    // open it
	    $("[data-role=popup]").popup({
	        dismissible: false,
	        history: false,
	        theme: "a",
	        /* or a */
	        positionTo: "window",
	        overlayTheme: "b",
	        /* "b" is recommended for overlay */
	        transition: "pop",
	        beforeposition: function () {
	            $.mobile.pageContainer.pagecontainer("getActivePage")
	                .addClass("blur-filter");
	        },
	        afterclose: function () {
	            $(this).remove();
	            $(".blur-filter").removeClass("blur-filter");
	        },
	        afteropen: function () {
	            /* do something */
	        }
	    }).popup("open");
	    
	    $("[data-role=popup]").trigger('create');
	    
	    /* 삭제 확인시 */
	    $(document).on('click','a#confirm',function(){
          	deleteList(idx);	
	    });
	}
	
}

/* 상부 UI 제어(등록, 내글보기 버튼) */
function btnControl(){
	var allBtn = $("#allBtn"), nav = $("#navbar"),
	    addBtn = $('#addBtn'), adminBtn = $("#adminBtn");
	/*  관리자의 경우 대기버튼 보여주기 */
	if(flag == true && userLv == "ADMIN"){
		addBtn.css('display','none');
		allBtn.css('display','none');
		adminBtn.css('display','block').removeClass('btn_space').addClass("bottom-mg-01");
		content.trigger('create');	
	/* 관리자의 경우 전체보기 버튼 보여주기 */
	}else if(flag == false && userLv == "ADMIN"){ 
		allBtn.css('display','block').removeClass('btn_space').addClass("bottom-mg-01");
		adminBtn.css('display','none');
		nav.trigger('create');
	}
}

/* 10개 출력후 다음 출력을 위해서 로딩바 표시 및 제어 함수*/
function loadingBar(rCount){
		
	if(userLv == "ADMIN" && cntIndex == count){ //더 출력할 컨텐츠가 있음을 아이콘으로 알려줌
		$('.loader').remove();
		$('<button>').text('처음으로 가기').addClass('top-loader center')
		.attr("onclick","reset()").appendTo(content);  
		$('div[data-role=content]').trigger('create'); 
		cntIndex = (cntIndex <= 0) ? count : cntIndex;
	}else if(cntIndex % 10 == 0 && cntIndex > 10){
		$('<div>').addClass('loader center ui-nodisc-icon')
		.append($('<a>').attr('href','#').addClass('ui-disabled')
		.addClass(pageDownStr)).appendTo(content);
		$('div[data-role=content]').trigger('create');  //refresh(부모에 할것)
	}
}

/* 초기화 함수 + LoadList(1)호출 */
function reset(){
	$('.dataRow').remove();
	$('.top-loader').remove();
	$('.loader').remove();
	if(userLv == "ADMIN" && flag == true){ // 전체글 출력시
      loadList(1, pageSize);
    }else{
      loadList(1, count);	
    }
} 

/* 페이지 생성 함수*/
function pageCreate(data){ // data: Json, number: Id판별 인덱스(j값)
	var aTime = (data.adatetime != null) ? data.adatetime.substr(0,11) : ""; //질문시간 
	var qTime = (data.qdatetime != null) ? data.qdatetime.substr(0,11) : ""; //응답시간
	
	if(data.answer == null || data.answer == '답변 대기중입니다.' || 
	   data.answer == ''){ //응답 내용이 없을 경우
	   answer = '답변 대기중입니다.'; //응답내용
	   mark = 'text-no-answer'; //응답여부 표시 아이콘(CSS)
	   str = '대기'; //아이콘에 들어갈 문자
	  }else{ // 그외 
	   answer = data.answer;
	   mark = 'text-answer remove-shadow';
	   str ='답변';
   }
	    
   var dataRow = $("<div>").addClass("dataRow").attr({
		"data-role":"collapsible", 
		"data-iconpos" : "left", 
		"data-inset" : "true",
		"data-collapsed-icon" : "carat-d", 
		"data-expanded-icon" : "carat-u"
	});
	
   var answerTag = $('<h1>').text(data.title).addClass('text-title')
	   .append($('<div>' + str + '</div>').addClass(mark));

   var inTitle = $('<div>').attr('data-role','fieldcontain').addClass('left')
	   .append($('<span>').html(data.title).addClass('left bold'));
   
   var info = function(img,id,time,hidden){
	   return $('<div>').css('margin-top','10px')   
	   .attr('data-role','fieldcontain bottom-mg-01')
	   .append($('<img>').attr('src',img).addClass('id-icon'))
	   .append($('<span>').text(hidden).addClass('left').css('display','none'))
	   .append($('<span>').text(id).addClass('float-left'))  
	   .append($('<span>').text(time).addClass('float-right'));
   }
      
   var mainText = function(subTitle, msg){
	   return $('<div>').attr('data-role','fieldcontain')
	    .addClass('left').append($('<div>').css('height','30px')
	    .text('[ '+ subTitle +' 내용 ]').addClass('bold bottom-mg-01'))
		.append($('<span>').html(msg).addClass('left'));
   }
   
   /* element 생성하여 데이터 화면표시*/
   function showData(){
    dataRow.append(answerTag).append(inTitle)
	       .append(info('people.png',data.memberId, qTime, data.qna_No))
	       .append(mainText('질문', data.question))
	       .append(info('home.png', '관리자', aTime, null))
	       .append(mainText('답변',answer)).appendTo(content);
	uiCreate();
   }
     	
	/* 수정, 삭제 버튼 생성 */
   function uiCreate(){
		var answer = data.answer;	
	
		if(userLv == "ADMIN" &&  (answer == '답변 대기중입니다.' || 
		   answer == ''|| answer  == null)){ 
		   msg = "답변"; str = 'rspBtn';
		   createBtn('b');
		}else if(userLv == "NORMAL" && (answer == "답변 대기중입니다." ||
	       answer == ''|| answer  == null)){ 
		   msg = "수정"; str = 'updateBtn';
		   createBtn('b');
		}else if(userLv == "ADMIN"){ 
		   msg = "수정"; str = 'rspBtn';
		   createBtn('b');
		}else{
		   createBtn('a');
		}

	  function createBtn(char){
		var element = $('<div>').addClass('ui-grid-' + char);
		
		var btn = function(block, msg, str){
		  return $('<div>').addClass('ui-block-' + block)
		         .append($('<a>').attr({ 'href':'#', 'data-role':'button'})
		         .addClass(str).text(msg));
		 }
				
		if(char == 'a'){
		  element
		   .append(btn('a', '삭제', 'deleteBtn').attr('data-transition','pop'))
		   .append(btn('b', '취소', 'cancelBtn')).appendTo(content.contents(":last"));
			
		}else{
		 element.append(btn('a', msg, str))
		   .append(btn('b', '삭제', 'deleteBtn').attr('data-transition','pop'))
		   .append(btn('c', '취소', 'cancelBtn')).appendTo(content.contents(":last"));
		}
	  }
	}
	
	/* 질문글 출력 제어*/
	if(userNo == data.memberNo && userLv == "NORMAL"){//글쓴이와 작성자가 일치할때만
		showData();
	}else if(userLv == "ADMIN" &&  flag == false
		&& (!data.answer || data.answer == '답변 대기중입니다.')){//대기 상태				
		showData ();
	}else if(userLv == "ADMIN" && flag == true){ //관리자일때만 전체 출력		
		showData();
	}
	
	$(".text-title").contents().addClass('text-block'); 
	$('div[data-role=content]').trigger('create'); // 화면갱신
}

/* 오류 메세지 출력 */
function errorPage(number){
	var str2 = null;
	if(number == 0) {  //error = 0
		str2 = '통신 오류!'; pageFlag = false; i=0; j=0;
	}else if(number == 1 && pageFlag == false) { // error = 1
		str2 = '데이터를 더이상 가져올 수 없습니다.'; pageFlag = false; 
	}else{
		return;
	}
	$('.errorMsg').remove();
	$('<div>').addClass('errorMsg center').append($('<h2>' + str2 + '</h2>'))
	.appendTo(content);
	$('div[data-role=content]').trigger('create'); 
}

/* ajax통신으로 getLoginUser에서 session 정보 가져옴*/
function getInfo(){
	$.getJSON(
			contextPath + '/auth/getLoginUser.ajax', 
			function(jsonObj) {
				var result = jsonObj.ajaxResult;
				if (result.status == "ok") {
					console.log(result.data);
					userId = result.data.id;
					userLv = result.data.level;
					userNo = result.data.no;
					if(userLv == "ADMIN"){
						btnControl();
					}else if(userId == "GUEST" && userLv == "NORMAL"){
						alert("회원 가입이 필요합니다.");
						location.href = contextPath + "/auth/login.html";
					}
				}else{
					alert("로그인하지 않았습니다.");
					location.href = contextPath + "/auth/login.html";
				}
	  });
}


/* 업데이트 */
function updateList(pos, no, title, question, answer, aDate, qDate){
	if (answer.length == 0 || title.length == 0 || question.length == 0){
		$('<div>').contents().remove();
		$('<div>').addClass("label-alarm red center")
		.append("제목과 내용은 필수 입력값입니다.").appendTo(pos);
		return;
	}else{
		$('label-alarm').remove();
	}
	
	$.ajax(bit.contextRoot + '/qna/update.ajax', {
		type: 'POST',
		dataType: 'json', 
		data: { 
			qna_No: Number(no),
			memberNo: Number(userNo),
			title: title,
			answer: answer,
			question: question,
			aDatetime: aDate,
			qDatetime: qDate
		},
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			location.href  = contextPath + "/qna/mobile_qna.html";
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("통신 장애");
			console.log(xhr.status);
			console.log(thrownError);
		}
	});
}

/* 삭제 */
function deleteList(idx){	
	console.log(idx);
	$.ajax(bit.contextRoot + '/qna/delete.ajax', {
		type: 'POST',
		dataType: 'json', 
		data: { 
			memberNo: Number(userNo),
			qna_No: Number(idx)
		},
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			console.log(result.data);
			idx = null;
			reset();
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("통신 장애");
			console.log(xhr.status);
			console.log(thrownError);
		}
	});
}

function getCount(pageNo){
	$.ajax(bit.contextRoot + '/qna/list.ajax?pageNo=' + pageNo + '&pageSize=1' 
		, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			var resultCount = result.data.list.length;
			if(result.status=='ok' && resultCount > 0){
				count = result.data.count; // 전체 record 개수 저장
				console.log(count);
				if(userLv == "NORMAL"){
			      loadList(currPageNo, count);
				}else{
				  loadList(currPageNo, pageSize);
				}
				return;
			}else{
				errorPage(1); //에러메세지 출력: 출력할 데이터 없음
				console.log(result.status);
				console.log(jsonObj);
			}
		},
		error: function(xhr, status, errorThrown){
			errorPage(0); // 에러메세지: 통신 오류
			console.log(status);
			console.log(errorThrown);
		}
	});	
}


/* 전체 회원 리스트용*/
function loadList(pageNo, pageSize){
	$.ajax(bit.contextRoot + '/qna/list.ajax?pageNo=' + pageNo + '&pageSize=' 
			+ pageSize, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			console.log(result);
			var resultCount = result.data.list.length; //입력받은 data-set 개수 저장
			if(result.status=='ok' && resultCount > 0){
				if(pageNo != 1) loadingBar(resultCount); //맨 첫줄에 loadingBar생기는 것 방지
				$('.errorMsg').remove(); //기존 오류메세지 다 삭제
				$.each(result.data, function(index,obj){
					$.each(obj, function(index,data){
						pageCreate(data);
						console.log(index,count);
						++cntIndex;
					});
				});
				currPageNo = pageNo;
				loadingBar(resultCount);
			}else{
				errorPage(1); //에러메세지 출력: 출력할 데이터 없음
				console.log(result.status);
				console.log(jsonObj);
			}
		},
		error: function(xhr, status, errorThrown){
			errorPage(0); // 에러메세지: 통신 오류
			console.log(status);
			console.log(errorThrown);
		}
	});	
}

