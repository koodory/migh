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
var arrayId = new Array(); // 작성자 전체 아이디 배열 *
var menuFlag = 0; //상단 UI 버튼 클릭시 0 : 등록/전체,  1:등록/내글, 2:등록/대기
var pageFlag = false; //페이지 상태, 오류메세지 제어
var count; //Q&A record 갯수 저장
var uiFlag = true; // 수정, 삭제버튼 제어
var cntIndex = null; //페이지 세는 변수

$(document).ready(function(){
	 서버의 세션에서 사용자 정보 가져옴 
	getInfo(); 
	 QNA 리스트 출력 
	loadList(currPageNo, pageSize); 
     내글 보기 버튼클릭시 
	$('#myBtn').click(function(event){  
		menuFlag = 1;
		pageControl(); reset();
	});
     전체보기 버튼 클릭시 
	$('#allBtn').click(function(event){ 
		menuFlag = 0;
		pageControl(); reset();
	});
     대기글 보기 버튼 클릭시 
	$('#adminBtn').click(function(event){
		menuFlag = 2;
		pageControl(); reset();
	});	
	
	 등록 버튼 클릭시 
	$(document).on('click','a.registBtn',function(){
		var currPos = $(this).parent().parent().parent().parent();
        var no = currPos.contents(":eq(1)").contents(":eq(1)").text();
        var pos =  $(this).parent().parent().parent();
        var aDate = currPos.contents(":eq(1)").contents(":last").text();
        var qDate = currPos.contents(":eq(3)").contents(":last").text();
        
        $('.label-alarm').remove();
        if(userLv == "ADMIN"){
            var title =  currPos.contents(":eq(0)").contents(":last").text();
            var question = currPos.contents(":eq(2)").contents(":last").text();
            var answer = currPos.contents(":eq(4)").contents(":eq(1)").val();
            if(qDate.length == 0){ qDate = currDate; }
        }else if(userLv == "NORMAL" ){
            var title =  currPos.contents(":first").contents(":last").val();
            var question = currPos.contents(":eq(2)").contents(":last").val();	
            var answer = currPos.contents(":eq(4)").contents(":eq(1)").text();
            if(aDate.length == 0){ aDate = null; } //답변일 초기화
            if(qDate.length == 0){ qDate = currDate;} //질문일을 현재일자로
        }
		updateList(pos, answer, title, question, no, aDate, qDate);
	});
		
	 답변 버튼 클릭시 
	$(document).on('click','a.rspBtn', function(){
		var textStr = '<textarea onfocus="javascript:this.value=\'\';">';
		var currPos = $(this).parent().parent();
	    var index = currPos.parent().contents(":eq(4)");      
        var answer = index.contents(":last").text(); 
   
	    index.contents(":last").remove();
	    $(textStr).val(answer).appendTo(index);
	    index.trigger('create');
        index.contents(":last").trigger('keyup');
                
	    uiRegister(currPos, index); 
	});
     수정 버튼 클릭시 
	$(document).on('click','a.updateBtn', function(){
		var textStr = '<textarea>';
		var currPos = $(this).parent().parent();
	    var index = currPos.parent().contents(":eq(4)"); //답변내용
        var index2 = currPos.parent().contents(":eq(2)"); //질문내용
        var index3 = currPos.parent().contents(":eq(1)"); //질문자 정보
        var index4 = currPos.parent().contents(":first"); //타이틀
        var answer = index.contents(":last").text();   
        var question = index2.contents(":last").text();
        var no = index3.contents(":eq(0)").text();
        var title =  index4.contents(":last").text();
        
	    if(userLv == "ADMIN"){
	      index.contents(":last").remove();
	      $(textStr).val(answer).appendTo(index);
	      index.trigger('create');
          index.contents(":last").trigger('keyup');
	    }else if(userLv == "NORMAL"){
          index4.contents(":last").remove();
		  $(textStr).val(title).appendTo(index4);
		  index4.trigger('create');
	      index4.contents(":last").trigger('keyup');	   	
		  index2.contents(":last").remove();
		  $(textStr).val(question).appendTo(index2);
	      index2.trigger('create');
          index2.contents(":last").trigger('keyup');
	    }
	    uiRegister(currPos, index); 
	});
     삭제 버튼 클릭시 
	$(document).on('click','a.deleteBtn', function(){
        idx = $(this).parent().parent().parent().contents(":eq(1)").contents(":first").css("border","red solid 1px").text();
        popup(idx);
	});
     취소 버튼 클릭시 
	$(document).on('click','a.cancelBtn', function(){
	  reset();
	});
	
	 스크롤 제어 
	$(document).on("scrollstart",function(){
		if($(document).height() > $(window).height())
		{
			if($(window).scrollTop() == $(document).height() - $(window).height()){
				loadList(currPageNo+1); //맨 하단으로 갈시 loadList를 1증가 시켜 실행
			}
		}
	});
	
});

 상부 UI 제어(등록, 내글보기 버튼) 
function pageControl(){
	var uiStrA = 'ui-block-a', uiStrB = 'ui-block-b', uiStrC = 'ui-block-c' ;
	var myBtn = $('#myBtn'), allBtn = $("#allBtn"), nav = $("#navbar"),
	    addBtn = $('#addBtn'), adminBtn = $("#adminBtn");

	 일반사용자의 경우 내글 버튼 보여주기 
	if(menuFlag == 0 && userLv == "NORMAL"){ 
		myBtn.css('display','block').addClass("btn-space-up");
		allBtn.css('display','none');
		adminBtn.css('display','none');
		nav.trigger('create');	
	  관리자의 경우 대기버튼 보여주기 
	}else if(menuFlag == 0 && userLv == "ADMIN"){
		nav.contents().removeClass();
		nav.removeClass();
		addBtn.css('display','none');
		myBtn.css('display','none');
		allBtn.css('display','none');
		adminBtn.css('display','block')
		  .removeClass('btn_space').addClass("bottom-mg-p01");
		nav.trigger('create');	
	 관리자의 경우 전체보기 버튼 보여주기 
	}else if(menuFlag == 2 && userLv == "ADMIN"){ 
		myBtn.css('display','none');
		allBtn.css('display','block')
	      .removeClass('btn_space').addClass("bottom-mg-p01");
		adminBtn.css('display','none');
		nav.trigger('create');
	 기본 버튼 설정 
	}else{
		myBtn.css('display','none');
		allBtn.css('display','block').addClass("btn-space-up");
		adminBtn.css('display','none');
		nav.trigger('create')
	}
}

 ajax통신으로 getLoginUser에서 session 정보 가져옴
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
						pageControl();
					} //세션에서 id, 등급, 번호정보를 추출하여 전역변수로 저장
				}else{
					alert("로그인하지 않았습니다.");
					location.href = contextPath + "/auth/login.html";
				}
	  });
}

 10개 출력후 다음 출력을 위해서 로딩바 표시 및 제어 함수
function loadingBar(event, rCount){
	cntIndex = count - rCount;
	if(event ==0 && menuFlag == 0 && cntIndex >0){ //더 출력할 컨텐츠가 있음을 아이콘으로 알려줌
		$('<div>').addClass('loader center ui-nodisc-icon')
		.append($('<a>').attr('href','#').addClass('ui-disabled')
				.addClass(pageDownStr))
				.appendTo(content);
		$('div[data-role=content]').trigger('create');  //refresh(부모에 할것)  
	}else if(event == 1){ //더 출력할 컨텐츠가 없을경우 처음로딩상태로 전환
		$('.loader').remove();
		$('<button>').text('처음으로 가기').addClass('top-loader center')
		.attr("onclick","reset()").appendTo(content);  
		$('div[data-role=content]').trigger('create'); 
		cntIndex = (cntIndex <= 0) ? count : cntIndex;
	}
}

 초기화 함수 + LoadList(1)호출 
function reset(flag){
	$('.dataRow').remove();
	$('.top-loader').remove();
	$('.loader').remove();
    loadList(1); 
	//모든 데이터 및 로더안내 문구를 삭제하고 다시 loadList()출력
} 

 데이터 전송 버튼 생성 
function uiRegister(currPos, index){
	currPos.remove();
	$('<div>').addClass('ui-grid-a')
	.append($('<div>').addClass('ui-block-a')
	  .append($('<a>').attr('href','#').attr('data-role','button').addClass("registBtn")	
      .text('등록')))
	  
	 .append($('<div>').addClass('ui-block-b')
	  .append($('<a>').attr('href','#').attr('data-role','button').addClass("cancelBtn")		
      .text('취소')))

	.appendTo(index); //컨텐츠의 마지막 자식 element에만 적용할 것
	index.trigger('create');
}

 내부 UI 생성 함수(수정, 삭제 버튼) 
function uiCreate(data){
	var str;
	var element = content.contents(":last");
	var answer = data.answer;	
	
	if(userLv == "ADMIN" &&  (answer == '답변 대기중입니다.' 
		|| answer == '' || answer  == null)){
		msg = "답변"; str = 'rspBtn'
	}else{
		msg = "수정"; str = 'updateBtn'
	}
	
	$('<div>').addClass('ui-grid-b')
	.append($('<div>').addClass('ui-block-a')
	  .append($('<a>').attr('href','#').attr('data-role','button').addClass(str)	
      .text(msg)))

	.append($('<div>').addClass('ui-block-b')
	  .append($('<a>').attr('href','#').attr('data-role','button')
			  .addClass("deleteBtn").attr('data-rel','popup')
	  .attr('data-transition','pop').text('삭제')))
	  
	 .append($('<div>').addClass('ui-block-c')
	  .append($('<a>').attr('href','#').attr('data-role','button').addClass("cancelBtn")		
	  .text('취소')))

	.appendTo(element); //컨텐츠의 마지막 자식 element에만 적용할 것 
}

 컨텐츠 생성 페이지 
function pageCreate(data){ // data: Json, number: Id판별 인덱스(j값)
	var str, answer, mark, qstDate, ansDate;
	var aTime = (data.adatetime != null) ? data.adatetime.substr(0,11) : ""; //질문시간 
	var qTime = (data.qdatetime != null) ? data.qdatetime.substr(0,11) : ""; //응답시간
	var member = data.memberNo, uiFlag = true; //회원번호, UI상태
	var admin = "관리자";
	
	// 응답 아이콘 제어
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
	
	// 회원 등급이 일반이고 유저번호가 일치하니 않는 경우
    if(member != userNo && userLv == "NORMAL") {
	  answer = "질문자만 답변을 볼 수 있습니다."
	  aTime = "";  uiFlag = false;
	}
    
	$("<div>") //화면 정보 출력
	.attr("data-role","collapsible").addClass('dataRow')
	.attr("data-iconpos","left")
	.attr("data-inset","true")
	.attr("data-collapsed-icon","carat-d").attr("data-expanded-icon","carat-u")
	
	.append($('<h1>').text(data.title).addClass('text-title')
	  .append($('<div>' + str + '</div>').addClass(mark)))

	  .append($('<div>').attr('data-role','fieldcontain').addClass('left')
		.append($('<span>').html(data.title).addClass('left bold')))
	  
	  .append($('<div>').attr('data-role','fieldcontain bottom-mg-p1')
	    .css('margin-top','10px')
	    .append($('<img>').attr('src','people.png').addClass('id-icon'))
		.append($('<span>').text(data.qna_No).addClass('left')
		.css('display','none'))
		.append($('<span>').text(data.memberId).addClass('float-left'))
		.append($('<span>').text(qTime).addClass('float-right')))
				
	  .append($('<div>').attr('data-role','fieldcontain').addClass('left')
		.append($('<div>').text('[ 질문 내용 ]').addClass('bold bottom-mg-p1')
		.css('height','30px'))
		.append($('<span>').html(data.question).addClass('left')))

	  .append($('<div>').attr('data-role','fieldcontain bottom-mg-p1')
	    .append($('<img>').attr('src','home.png').addClass('admin-icon'))		  
		.append($('<span>').text(admin).addClass('float-left')
		.css('margin-top','10px'))
		.append($('<span>').text(aTime).addClass('float-right')
		.css('margin-top','10px')))  

	  .append($('<div>').attr('data-role','fieldcontain').addClass('left')
		.append($('<div>').text('[ 답변 내용 ]').addClass('bold bottom-mg-p1')
		.css('height','30px'))		
		.append($('<span>').addClass('left').html(answer)))
		  .appendTo(content); 
	
	if(uiFlag == true) uiCreate(data); //작성자와 유저가 같을 때만 UI 생성
	$(".text-title").contents().addClass('text-block'); //제목이 모두 표시(CSS)
	$('div[data-role=content]').trigger('create'); // 주입한 객체의 부모에 trigger 사용
}


 오류 메세지 출력 
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

 업데이트 
function updateList(pos, answer, title, question, no, aDate, qDate){
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

 삭제 
function deleteList(idx){	
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

 전체 회원 리스트용
function loadList(pageNo){
   pageSize = (menuFlag == 0) ? 10 : count;
	
	$.ajax(bit.contextRoot + '/qna/list.ajax?pageNo=' + pageNo + '&pageSize=' 
			+ pageSize, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			console.log(result);
			var resultCount = result.data.list.length; //입력받은 data-set 개수 저장
			count = result.data.count; // 전체 record 개수 저장
			if(result.status=='ok' && resultCount > 0){
				if(pageNo != 1) loadingBar(0, resultCount); //맨 첫줄에 loadingBar생기는 것 방지
				$('.errorMsg').remove(); //기존 오류메세지 다 삭제
				$.each(result.data, function(index,obj){
					$.each(obj, function(index,data){
						if(userNo == data.memberNo && userLv == "NORMAL" 
							&& menuFlag == 1){//글쓴이와 작성자가 일치할때만
							pageCreate(data); 
						}else if(userLv == "ADMIN" &&  menuFlag == 2 
							&& (!data.answer || data.answer == '답변 대기중입니다.')){//대기 상태				
							pageCreate(data);
						}else if(menuFlag == 0){				
							pageCreate(data);
						}
					});
				});
				currPageNo = pageNo;
				if(resultCount >= 10){					
					loadingBar(0, resultCount); //10개 이상 출력시 아이콘 알림 로딩바
				}else{
					loadingBar(1,resultCount); //더이상 출력 데이터 없을시 처음으로 가는 버튼 출력 
					pageFlag = true; //loadingBar()제어용 flag 변수 
				}
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

 팝업 클릭	
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
                  .append($('<a>').attr('href','#').attr('data-role','button')
                  .attr('role','button').attr('id','confirm').attr('data-rel',"back")
                  .addClass('confirm-btn').text('확인')))
                .append($('<div>').addClass('ui-block-b')  
                  .append($('<a>').attr('href','#').attr('data-role','button')
                  .attr('role','button').attr('id','cancel').attr('data-rel',"back")
                  .addClass('cancel-btn').text('취소')))
     
     // Popup body - set width is optional - append button and Ajax msg
     var popup = $("<div/>", {
         "data-role": "popup",     	 
     }).css({
         width: $(window).width() / 1.2 + "px",
         padding: 10 + "px",
         height: $(window).height() / 4  + "px"
     }).append(closeBtn).append(content).append(btn);
     // Append it to active page
     $.mobile.pageContainer.append(popup).css("text-align","center");

    // Create it and add listener to delete it once it's closed
    // open it
    $("[data-role=popup]").popup({
        dismissible: false,
        history: false,
        theme: "a",
         or a 
        positionTo: "window",
        overlayTheme: "b",
         "b" is recommended for overlay 
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
             do something 
        }
    }).popup("open");
    
    $("[data-role=popup]").trigger('create');
    
     삭제 확인시 
    $(document).on('click','a#confirm',function(){
    	console.log(idx + "확인클릭시")
    	deleteList(idx);
    	
    });

}
