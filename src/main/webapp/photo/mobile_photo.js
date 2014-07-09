var pageDownStr = 'ui-btn ui-shadow ui-corner-all ui-icon-arrow-d ui-btn-icon-notext ui-btn-b ui-btn-inline'
var contentWidth = ($(document).width())/1.1;	
var getWidth = ($(document).width() - 30)/1.2;	
var getHeight = ($(document).height())/4;	
var date = new Date();
var month = date.getMonth()+1;
if(month  < 10){ month = '0' + month;}
var currDate = date.getFullYear() + '-' + month + '-' + date.getDate(); // 현재 날짜 가져오기
var contextPath = bit.getContextRootPath(); //루트 경로 가져오기
var userId, userLv, userNo; // 사용자 아이디, 사용자 등급, 사용자 관리번호
var currPageNo=1, pageSize=5, count; // 현재페이지, 페이지사이즈, 사진 record 갯수
var pageFlag = false, cntIndex = 0;// 페이지 제어 변수, 카운트를 세는 변수, 읽어오며 증가하는 페이지 갯수, 한페이지당 읽어오는 갯수

$(document).ready(function(){
	getInfo();
	getCount(currPageNo);
	setUI();
});

/* ajax 통신으로 getLoginUser에서 session 정보 가져옴*/
function getInfo(){
	$.getJSON(
			contextPath + '/auth/getLoginUser.ajax', 
			function(jsonObj) {
				var result = jsonObj.ajaxResult;
				if (result.status == "ok") {
					userId = result.data.id;
					userLv = result.data.level;
					userNo = result.data.no;
					if(userLv == "ADMIN"){
					}else if(userId == "GUEST" && userLv == "NORMAL"){
						alert("사진 보기만 가능합니다.");
//						location.href = contextPath + "/auth/login.html";
					}
				}else{
					alert("통신오류");
//					location.href = contextPath + "/auth/login.html";
				}
			});
}

/* Pho_Idx 카운트(갯수에 따라 변화주기) */
function getCount(pageNo){
	$.ajax(bit.contextRoot + '/photo/list.ajax?pageNo=' + pageNo + '&pageSize=1' 
			, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			var resultCount = result.data.list.length;
			if(result.status == 'ok' && resultCount > 0){
				count = result.data.count; // 전체 record 개수 저장
				loadList(currPageNo, pageSize);
			}else{
				errorPage(1);
				console.log(result.status);
			}
		},
		error: function(xhr, status, errorThrown){
			errorPage(0);
			console.log(status);
			console.log(errorThrown);
		}
	});	
}

/* 전체 회원 리스트용*/
function loadList(pageNo, pageSize){
	$.ajax(bit.contextRoot + '/photo/list.ajax?pageNo=' + pageNo + '&pageSize=' 
			+ pageSize, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			var resultCount = result.data.list.length; //입력받은 data-set 개수 저장
			$('.errorMsg').remove(); //기존 오류메세지 다 삭제
			if(result.status == 'ok' && resultCount > 0){
				$.each(result.data, function(index,obj){
					$.each(obj, function(index,data){
						cntIndex++;
						pageCreate(data);
					});
				});
				currPageNo = pageNo;
				loadingBar(pageNo, pageSize);
			}else{
				errorPage(1);
				console.log(resultCount);
				console.log(result.status);
			}
		}, 
		error: function(xhr, status, errorThrown){
			errorPage(0);
			console.log(status);
			console.log(errorThrown);
		}
	});	
}

///* 사진 게시물 업데이트 */
////회원번호, 제목, 사진, 사진내용, 게시물 생성일
//function updateList(node, no, getTitle, getPhotos, getContent, getDate, idx){
//	console.log("form에 찍힌 console");
//	console.log($(".photosTitle").val());
//	console.log($(".photosContent").val());
//	console.log($(".photoFile").val());
//	if($(".photosTitle").val() == (null||"") ||	$(".photosContent").val() == (null||"")||
//			$(".photoFile").val() == (null||"")){
//		$('<div>').contents().remove();
//		$('<div>').addClass("label-alarm red center")
//		.append("제목,사진,내용은 필수 입력값입니다.").appendTo(node);
//	}else{
//		$('<div>').contents().remove();
//		$('.label-alarm').remove();
//	}
//	var formObj = $(this);
//	var formURL = formObj.attr("action");
//	formData = new FormData(this);
//	
//	console.log(formData);
//
//	$.ajax(formURL,{
//		type: 'POST',
//		dataType: 'json', 
//		data: { 
//		photosNo: Number(idx),
//		memberNo: Number(no),
//		photosTitle: getTitle,
//		photosContent: getContent,
//		photosImg: getPhotos,
//		photosCrDate: getDate
//		},
//		success: function(jsonObj)
//		{
//			location.href  = contextPath + "/photo/mobile_photo.html";
//		},
//		error: function(jqXHR, textStatus, errorThrown) 
//		{
//			console.log("error");
//			console.log(textStatus);
//			console.log(errorThrown);
//		} 	        
//	});
//};

/* 사진 게시물 업데이트 */
$(".multiform").submit();
//회원번호, 제목, 사진, 사진내용, 게시물 생성일
$(".multiform").on("submit",function(e){
	alert("update test");
	e.preventDefault();
	console.log("form에 찍힌 console");
	console.log($(".photosTitle").val());
	console.log($(".photosContent").val());
	console.log($(".photoFile").val());
	// 유효값 검증
	if($(".photosTitle").val() == (null||"") ||	$(".photosContent").val() == (null||"")||
			$(".photoFile").val() == (null||"")){
		$('<div>').contents().remove();
		$('<div>').addClass("label-alarm red center")
		.append("제목,사진,내용은 필수 입력값입니다.").appendTo(node);
	}else{
//		$('<div>').contents().remove();
		$('.label-alarm').remove();
	}
	var formObj = $(this);
	var formURL = formObj.attr("action");
	formData = new FormData(this);
	
	console.log(formData);

	$.ajax(formURL,{
		type: "POST",
//		type: "$.post",
		data: formData,
		mimeType:"multipart/form-data",
		contentType: false,
//		ContentType: json,
//		ContentType: "application/javascript",
		cache: false,
		processData:false,
		success: function(data, textStatus, jqXHR)
		{
			console.log("success");
			reset();
			location.href  = contextPath + "/photo/mobile_photo.html";
		},
		error: function(jqXHR, textStatus, errorThrown) 
		{
			console.log("error");
			console.log(textStatus);
			console.log(errorThrown);
		} 	        
	});
});

/* 삭제 */
function deleteList(idx){	
	$.ajax(bit.contextRoot + '/photo/delete.ajax', {
		type: 'POST',
		dataType: 'json', 
		data: { 
			photosNo: Number(idx),
			memberNo: Number(userNo)
		},
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
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

/*페이지 생성*/
function pageCreate(data){

	var path = '../upload/' + data.photosImg; // 웹서버에 업로드 된 이미지 경로

	var pTime = data.photosCrDate.substr(0,11); // 사진 등록일

	/*아이디, 게시물 생성일, 회원번호, 게시물 번호*/
	var id = $("<div>").append($("<span>").text(data.memberId))
	.append($("<span>").addClass("fright").text(pTime))
	.append($("<span>").css("display","none").text(data.memberNo))
	.append($("<span>").css("display","none").text(data.photosNo));

	/*사진 제목*/
	var title = $("<div>").append($("<span>").text(data.photosTitle));

	/*사진 및 사진 내용*/
	var content = $("<div>")
	.append($("<div>").addClass("bold bottom-mg-01 bgl2"))
	.append($("<img>").addClass("bgl2").css("width", getWidth)
			.css("height",getHeight).attr("src", path))
			.append($("<div>").addClass("bold bottom-mg-01"))
			.append($("<div>").text(data.photosContent));

	/* 수정, 삭제, 취소 버튼 생성 */
	var uiBtn = function (grid,btn,msg){
		return $('<div>').addClass("ui-block-" + grid)
		.append($("<a>").attr('href','#').attr("data-role","button")
				.addClass(" button-wrap").addClass(btn).text(msg));
	};

	if (userNo == data.memberNo){
		var totUiBtn = $("<div>").addClass("right ui-grid-b").append(uiBtn("a","updateBtn","수정"))
		.append(uiBtn("b","deleteBtn","삭제")).append(uiBtn("c","cancelBtn","취소"));
//		var totUiBtn = $("<div>").addClass("right ui-grid-a")/*.append(uiBtn("a","updateBtn","수정"))*/
//		.append(uiBtn("a","deleteBtn","삭제")).append(uiBtn("b","cancelBtn","취소"));
	}else if(userLv == "ADMIN"){
		var totUiBtn = $("<div>").addClass("right ui-grid-a").append(uiBtn("a","deleteBtn","삭제"))
		.append(uiBtn("b","cancelBtn","취소"));
	}

	/*페이지 생성*/				
	var total = $("<div>").addClass("bgi bgl3 left").css("margin-top","10px").css("border","lightgray solid 1px")
	.append(id).append(title).append(content).append(totUiBtn).appendTo($("#content").css("width","contentWidth"));
}


/* 스크롤 제어시 오류 메세지 출력 */
function errorPage(number){
	var msg = null;
	if(number == 0) {  //error = 0
		msg = '통신 오류!'; pageFlag = false; 
	}else if(number == 1 && pageFlag == false) { // error = 1
		msg = ''; pageFlag = false; 
	}else{
		return;
	}
	$('.errorMsg').remove();
	$('<div>').addClass('errorMsg center').append($('<h2>' + msg + '</h2>'))
	.appendTo("#content");
	$('div[data-role=content]').trigger('create'); 
}

/* 5개 출력후 다음 출력을 위해서 로딩바 표시 및 제어 함수*/
function loadingBar(pageNo, pageSize){
	var finalBar = function(msg, func){
		$('.loader').remove();
		$("<button>").text(msg).addClass('top-loader center')
		.attr("onclick", func).appendTo("#content");  
		$('div[data-role=content]').trigger('create'); 
		cntIndex = (cntIndex >=  count) ? 0 : cntIndex;
	}
	var infiniteIcon = function(){
		$('.loader').remove();
		$('<div>').addClass('loader center ui-nodisc-icon')
		.append($('<a>').attr('href','#').addClass('ui-disabled')
				.addClass(pageDownStr)).appendTo("#content");
		$('div[data-role=content]').trigger('create');  //refresh(부모에 할것)
	}

	if(cntIndex == count){ //처음으로 가기 
		finalBar("처음으로 이동","reset()");
	}else if(cntIndex >= pageSize){
		infiniteIcon();
	}else if(cntIndex == count){
		finalBar("처음으로 이동","reset()");
	}
}

function reset(){
	$('.bgi').remove();
	$('.top-loader').remove();
	$('.loader').remove();
	loadList(1, pageSize);
}

function setUI(){	

	var getValue = function(tag, key){

		var node =  tag.parent().parent().parent(); // 컨텐츠

		var index = node.contents(":eq(3)"); // 등록 버튼 생성 위치

		var getElement = function(index1, index2){
			return node.contents(":eq(" + index1 + ")").contents(index2);
		}	 //원하는 위치에 컨텐츠를 잡아줌.

		var formStr = $("<form>").addClass("multiform").attr("name","multiform").attr("action","update.ajax")
		.attr("method","POST").attr("enctype","multipart/form-data").attr("data-ajax","false");
		var getDate = currDate;

		var textStr = (key == 'mod') ?
				'<textarea>' : '<textarea onfocus="javascript:this.value=\'\';">' ;
		// 수정 버튼일시 태그를 <textarea>로 주거나, 그게 아닐 경우 내부 값을 없애버림

		var imgStr = "<input type='file'>";

		var totalStr = function (){
			var newElement = index.parent();
			index.contents().remove();
			formStr.append($(textStr).attr("name","photosNo").attr("data-role","none").css("display","none")
					.addClass("photosNo").text(no.text())) 			// 회원번호
			.append($(textStr).attr("name","memberNo").attr("data-role","none").css("display","none")
					.addClass("memberNo").text(idx))				// 사진 게시물 번호
			.append($(textStr).attr("name","photosTitle").addClass("photosTitle").text(getTitle.text()))	// 게시물 제목
			.append($(imgStr).attr("name","photoFile").addClass("photoFile").text(getPhotos.val()))		// 사진 파일
			.append($(textStr).attr("name","photosContent").addClass("photosContent").text(getContent.text()))	// 게시물 내용
			.append($(textStr).attr("name","photosCrDate").attr("data-role","none").css("display","none")
					.addClass("photosCrDate").text(getDate))			// 게시물 등록일자
			.append(uiRegister).appendTo(index);
			removeElement(getTitle);
			removeElement(getPhotos);
			removeElement(getContent);
			newElement.trigger('create');
			newElement.contents(":last").trigger('keyup');
			console.log("totalStr에 찍힌 console");
			console.log($(".photosTitle").val());
			console.log($(".photosContent").val());
			console.log($(".photoFile").val());
		};

		var no = getElement(0,":eq(2)"); // 회원번호

		var getTitle = getElement(1,":eq(0)");  // 사진 게시물 제목

		var getPhotos = getElement(2,":eq(1)"); // 사진 게시물 사진파일

		var getContent = getElement(2,":eq(3)"); // 사진 게시물 내용

		var idx = getElement(0,":eq(3)").text(); // 사진 게시물 번호.

		var list = new Array(); // from 0 --> 회원번호, 제목, 사진, 사진내용, 게시물 생성일

		var setValue = function(){ //문자열값 구하는 함수
			var elements = [no, getTitle, getPhotos, getContent]; 
			$.each(elements, function(index,value){
				if(value.prop('tagName') == 'TEXTAREA'){
					list[index] = value.val(); 
				}else{
					list[index] = value.text();
				}
			});
		};
		
		var removeElement = function (element){
			element.remove();
		};

		switch(key){
	    case 'reg':  //등록 버튼 클릭
            setValue();
        	console.log("등록버튼을 전송하는데 찍힌 console");
        	console.log($(".photosTitle").val());
        	console.log($(".photosContent").val());
        	console.log($(".photoFile").val());
            //회원번호, 제목, 사진내용, 사진, 게시물 생성일
//            updateList(node, list[0], list[1], list[2], list[3], getDate, idx); 
	        break;
		case 'mod' : //수정 버튼 클릭
			setValue();
			//새롭게 버튼 생성
			totalStr();
			console.log($(".multiform"));
			break;
		case 'del'  : // 삭제 버튼 클릭 
			popup(idx);
			break;
		}      
	}
//	/* 등록 버튼 클릭시 */
//	$(document).on('click','input.registBtn',function(){
//        $('.label-alarm').remove();
//        getValue($(this),'reg');
//	});		

	/*수정 버튼 클릭시 */
	$(document).on('click','a.updateBtn', function(){  
		getValue($(this),'mod');
	});
	/* 삭제 버튼 클릭시 */
	$(document).on('click','a.deleteBtn', function(){
		getValue($(this),'del');
	});
	/*취소 버튼 클릭시 */
	$(document).on('click','a.cancelBtn', function(){
		reset();
	});

	/*스크롤 제어 */
	$(document).on("scrollstart",function(){
		if($(document).height() > $(window).height())
		{
			if($(window).scrollTop() == $(document).height() - $(window).height()
					&& cntIndex != 0){
				loadList(currPageNo+1, pageSize); //맨 하단으로 갈시 loadList를 1증가 시켜 실행
			} 
		}
	});

	/*수정시 데이터 전송 버튼 생성*/ 
	var uiRegister = $('<div>').addClass('ui-grid-a')
	.append($('<div>').addClass('ui-block-a')
			.append($('<input>').attr('href','#').attr('data-role','button')
					.attr("type","submit").attr("value","등록").addClass("registBtn")))

					.append($('<div>').addClass('ui-block-b')
							.append($('<a>').attr('href','#').attr('data-role','button')
									.addClass("cancelBtn").text('취소')));

	/*팝업 클릭*/	
	function popup(idx) {
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
			/*or a */
			positionTo: "window",
			overlayTheme: "b",
			/*"b" is recommended for overlay*/ 
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
				/*    do something */
			}
		}).popup("open");

		$("[data-role=popup]").trigger('create');

		/*삭제 확인시*/ 
		$(document).on('click','a#confirm',function(){
			deleteList(idx);	
		});
	}

}
