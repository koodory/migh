var currDate = Date.today;
var getWidth = $(document).width() - 30;
var getHeight = ($(document).height())/4;
var slideWidth = getWidth/4;
var contextPath = bit.getContextRootPath(); 
var count, currNo = 0, fisrtNo = 0;
var user = {};
var room = {}; 
var rsv = {
		no: null, memberNo: null, roomNo: null, headcount: null, checkin: null,		
		checkout: null, basicPrice: null, deposit: 0, discount: 0,
		payStatus: "N", rsvStatus: "N", refund: 0};
var result, roomNo = 1, night;
var count, revIdx;
var tomorrow = new Date.today().addDays(1).toString("yyyy-MM-dd");
var todays = Date.today().toString("yyyy-MM-dd");
var seasonStart = new Date(2014, 6, 1);
var seasonEnd= new Date(2014, 7, 31);
var unAvailableDates = [];
var tempIndate, tempOutdate;

$(document).ready(function(){
	/** 객실 UI **/
	/* 슬라이드 css 설정*/
	$('.slide-main-space').css({
		'width': getWidth,
		'height':getHeight,
		'margin-bottom': '-7px'
	});

	$('.image-size').css('max-height',getHeight);
	/* 이미지 슬라이더 속성 설정*/
	$('#imageGallery').lightSlider({
		gallery:true,
		minSlide:1,
		maxSlide:1,
		currentPagerPosition:'left'  
	});  
	/* 객실 이전 버튼*/
	$('#prevBtn').click(function(){
		moveBackward();
	});
	/* 객실 다음 버튼*/
	$('#nextBtn').click(function(){
		moveFoward();
	});
	/* 오른쪽으로 이동*/
	function moveFoward(){
		roomNo++;
		if (roomNo > count + revIdx) {
			roomNo = 1 + revIdx; pageControl(roomNo);
		}else{
			pageControl(roomNo);
		}
	}
	/* 왼쪽으로 이동*/
	function moveBackward(){
		roomNo--;
		if (roomNo < 1 + revIdx) {
			roomNo = count + revIdx; pageControl(roomNo);
		}else{
			pageControl(roomNo);
		}
	}
	
	/**  예약 UI  **/
	/* datepicker 공용 설정*/
	$.datepicker.setDefaults({ 
		minDate: "+0d",
		beforeShowDay: function(date) { // 예약일 화면처리
			var dayoff = date.getFullYear() + "-";

			if(date.getMonth()<9)
				dayoff += "0" + (date.getMonth() + 1) + "-";
			else 
				dayoff += (date.getMonth() + 1) + "-";

			if(date.getDate()<10) dayoff += "0"; 
			dayoff += date.getDate(); 

			if ($.inArray(dayoff, unAvailableDates) != -1) {
				return [false,"bg-disabled","unAvailable"]; //예약불가
			} else{
				return [true, "","Available"];  //가능
			}
		},
		changeMonth: true,
		changeYear: false,
		gotoCurrent: true,
		monthNamesShort: ["1월","2월","3월","4월","5월","6월",
		                  "7월","8월","9월","10월","11월","12월"],
		dayNamesMin: ["일" , "월", "화", "수", "목", "금", "토"],
		showAnim: "slideDown"
//    onSelect: function(){
//      var day1 = $("#checkin").datepicker('getDate').getDate()+1;                 
//      var month1 = $("#checkin").datepicker('getDate').getMonth() + 1;             
//      var year1 = $("#checkin").datepicker('getDate').getFullYear();
//      var fullDate = year1 + "-" + month1 + "-" + day1;
//      var str_output = alert(fullDate);
//  }
	});
	/* 입실날짜 입력*/	
	$("#checkinInput").focus(function(){
		confirmRSV();	
	});
	/* 퇴실날짜 입력*/	
	$("#checkoutInput").focus(function(){
		confirmRSV();	
	});
	/* 날짜 입력 취소*/	
	$(document).on("click","#cancel", function(){
		clearForm();
	})
	/* 예약날짜 팝업확인 버튼(입실,퇴실 공용)*/
	$(document).on("click", ".confirm-date", function () {
		rsv.basicPrice = null;
		var label =$("div[data-role=popup]").contents(":eq(2)").prop("id");
		$("#"+label+"Input").val($("#"+label).val());
		getAllDays();
	});
	/* 예약날짜 팝업취소 버튼(입실,퇴실 공용)*/
	$(document).on("click",".cancel-date", function(){
		var label =$("div[data-role=popup]").contents(":eq(2)").prop("id");
		$("#"+label+"Input").val("");
	});

	/* 객실 정보를 터치로 이동할수 있게끔 설정하는 함수*/
	function touchCreate(){
		$(document).on('swipeleft','div#touch-area',function(){
			moveBackward();
		});

		$(document).on('swiperight','div#touch-area',function(){
			moveFoward();
		});
	}
	
	$(window).trigger('resize');
	loadRoomList();
	touchCreate();
});

/* 방 정보 데이터 로드*/
function loadRoomList(){
	$.ajax(bit.contextRoot + '/room/list.ajax', {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			result = jsonObj.ajaxResult;
			rCount = result.data.list.length; 
			if(result.status=='ok' && rCount > 0){
				console.log(result);
				count = result.data.count;
				pageControl(roomNo);
			}else{
				alert("No data");
				console.log(result.status);
				console.log(jsonObj);
			}
		},
		error: function(xhr, status, errorThrown){
			alert("No connection");
			console.log(status);
			console.log(errorThrown);
		}
	});	
}

function pageControl(roomNo){
	var num = 0, index = 0, data, cnt=new Array(), max = 4;
	$.each(result.data, function(index1,obj){		
		$.each(obj, function(index2,data){
			if(data.count){
				if(index2 == 0) { revIdx =  data.no - 1; } //방번호가 1이 아닐경우 보정
				cnt[index2] = data.count; // 각방의 사진개수를 저장하는 배열
			}else if(data.no == roomNo){ //현재 방번호와 일치하는 데이터만
				showData(data, index2, cnt);
		    if(cnt[index2] != max){ // 방 썸네일 사진 갯수가 max 이하이면
		    	imageCheck(cnt[index2]);
		    }
			}else if(data.picPath && data.roomNo == roomNo){ //방번호 일치 사진만
				showPic(data, num++, true);
			}
		});	
	});		
	/* 사진 링크 대체(사진 보여주기)*/
	function showPic(data, num, flag){
		var path = (flag == true) ?
				('../upload/' + data.picPath) : ('../img/no image.jpg');

				var link = function(name){
					$(name).contents(":eq("+ num +")").contents(":first").contents()
					.attr("src",path);
				}

				var changePic = function(){
					link('.csPager'); //thumbnail
					link('#imageGallery'); //main picture
				}
				changePic();
	}
  /* 객실 데이터 표시*/
	function showData(data, index2, cnt){
		roomNo = data.no;

		var title = function(name){
			if(data.name){
				$(name).contents().remove();
				$('<h3>').text(data.name)	.addClass('ui-title bold').attr('aria-level','1')
				.appendTo(name);
			}
		}
		title('div[data-role=header]'); //방이름 변경
		$('.dataRow').remove();

		$.each(data, function(index, value){ //방 데이터 파싱 
			room[index] = value; // 현재 방 정보 저장
			$('<span>').addClass('dataRow').append(value).appendTo('#'+index); 
		})
	}

	function imageCheck(number){ //사진이 없을 시 no-image 출력
		for(var i=number; i< 4; i++){
			showPic(number, i, false);
	  }
	}
}

/* 날짜 배열 만들기 */
var getAllDays = function () { 
	var checkin = $("#checkinInput").val();
	var checkout = $("#checkoutInput").val();
	var first = objDate($("#checkinInput").val());
	var start = objDate(checkin);
	var end = objDate(checkout).add(-1).day(); //퇴실 하루전
	var array = [], strArray = [];

	array.push(first); //초기값 +1 되는 이슈 때문에 값을 분리하여 초기값 처음 입력
	night = 1; //초기 숙박일 설정;

	while(start < end) {
		array.push(start);
		start = new Date(start.setDate(
				start.getDate() + 1
		))
		night = array.length;
	}

	/* 예약일을 Date객체 배열로 변환*/
	$.each(array, function(index,value){
		Price(value);
		strArray[index] = value.toString("yyyy-MM-dd");
	});
	/* 기존예약일과 겹치는지 검사 */
	$.each(strArray, function(index,value){
		if($.inArray(value, unAvailableDates) != -1){ //-1 : 두 값이 동일하지 않음
			if(checkin) $("#checkoutInput").val("");
			return; // 기존 예약일과 겹침
		}else{
			console.log("예약가능 : ", value);
		}/* 예약 정보 출력*/
		if(index == strArray.length-1 && checkout != null && checkout != ""  
			&& objDate(checkin) < objDate(checkout)){ 
			rsv.checkin = checkin;
			rsv.checkout = checkout;
			$("#rsv-confirm-btn").css("display","block");
			confirmRSV();
		}else{
			$("#rsv-confirm-btn").css("display","none");
			clearForm();
		}
	});
	/* 기본 숙박비 계산(시즌,주말) */
	function Price(value){
		var finalPrice = function(date){
			if(value.between(seasonStart, seasonEnd) == true){
				rsv.basicPrice += (date == "weekdays") ? 
						room.peakWdPrice : room.peakWePrice;
			}else{
				rsv.basicPrice += (date == "weekdays") ? 
						room.offWdPrice : room.offWePrice;
			}
		}

		if(value.toString().substr(0,3) == "Sat" || 
				value.toString().substr(0,3) == "Sun"){
			finalPrice("weekend");
		}else{
			finalPrice("weekdays");
		}
	}

	return array;
};
/* 데이트피커 날짜 입력 오류처리*/
var setDatePicker = function(element){
  $(element).datepicker();
  
	if(element == "#checkout" && $("#checkinInput").val() != null &&
			$("#checkinInput").val() != "" ){

		var minDate = $(element).datepicker( "option", "minDate" );		
		var checkMin = objDate($("#checkinInput").val()).add(1).day();//하루뒤

		if((Date.today().compareTo(checkMin)) == -1){
			$(element).datepicker("option","minDate", checkMin);
		}else{
			$(element).datepicker("option","minDate", objDate(tomorrow));
		}
	}else if($(element + "Input").val() != null && $(element + "Input").val() != "" ){
		$(element).datepicker("setDate", $(element+"Input").val()); 
	}
}
/* Date 객체 생성 함수 */
var objDate = function(date){  
	return new Date(
			// year, month, day
			parseDate(date)[0], parseDate(date)[1]-1 , parseDate(date)[2]);
}
/* 예약사항 출력*/
var confirmRSV = function(){	
	var checkin = $("#checkinInput").val();
	var checkout = $("#checkoutInput").val();
	var totCost = rsv.basicPrice - rsv.discount - rsv.deposit;
	var rsvText = (rsv.rsvStatus == "Y") ? "예약" : "예약대기";
	var payText = (rsv.payStatus =="Y") ? "완납" : "미납";
	rsv.refund = (rsv.payStatus == "Y") ? (rsv.deposit + totCost) : rsv.deposit;

	var showDate = function(date){
		var resultText = parseDate(date)[0] + "년 " + parseDate(date)[1] + "월 " +
		parseDate(date)[2] + "일";

		return resultText;
	} 

	var rsvDay = Date.today().toString("yyyy-MM-dd"); 

	var title = $("<div>").text(user.name + "님의 예약사항")
	.addClass("rsv-title");
	var rsvDate = $("<div>").text("예약일 : " + showDate(rsvDay))
	.addClass("rsv-date");

	var tableData = function(name, value){
		return   $("<tr>").append($("<td>").text(name).addClass("rsv-label"))
		.append($("<td>").text(value).addClass("rsv-text"));
	}

	var table = $("<table>").addClass("rsv-table")
	.append(tableData("예약상태", rsvText))
	.append(tableData("방이름",room.name))
	.append(tableData("숙박인원", rsv.headcount + "명"))
	.append(tableData("입실날짜", showDate(checkin)))
	.append(tableData("퇴실날짜", showDate(checkout)))
	.append(tableData("숙박기간", night + "박 " + (night+1) + "일"))
	.append(tableData("기본 입실료", rsv.basicPrice + "원"))
	.append(tableData("예약금", rsv.deposit + "원"))
	.append(tableData("할인료", rsv.discount + "원") )
	.append(tableData("결제예정금액", totCost + "원"))
	.append(tableData("완납여부", payText))

	$("#showDetail").contents().remove();
	$("#showDetail").append(title).append(rsvDate).append(table);
}

function clearForm(){
	$("#showDetail").contents().remove();
}

function cleanData(){
	$("#showDetail").contents().remove();
	$("#checkinInput").val("");
	$("#checkoutInput").val("");
}

var parseDate = function(date){
	var value = {};
	var dateArray = date.split("-");
	$.each(dateArray, function(index, data){
		if(index > 0 && dateArray[index].substr(0,1) == 0){
			value[index] = dateArray[index].substr(1,1);
		}else{
			value[index] = dateArray[index];
		}
	})
	return value;
}

/* 팝업창*/
function popup(idx, message, subtitle) {
	var title = $('<h3>').text(message).addClass("center");
	var subText = $("<div>").append(subtitle).addClass("top-mg-01 bottom-mg-01");
	var num = idx.split("-")[3]; //예약 리스트 인덱스

	var content = $('<div>').attr("id",idx)
	.css({"margin-left":"auto","margin-right":"auto"});

	var createBtn = function(block, id, name, msg){
		return  $('<div>').addClass('ui-block-' + block)
		.append($('<a>')
				.attr({'href':'#', 'data-role':'button', 'role':'button', 'id': id, 
					'data-rel':"back"}).addClass(name).text(msg));
	}

	var btn = $('<div>').addClass("ui-grid-a")
	.css({"max-width":"340px","margin-left":"auto","margin-right":"auto"})
	.append(createBtn('a', "confirm", "confirm-date",'확인'))
	.append(createBtn('b', "cancel", "cancel-date",'취소'));


	var setHeight = (subtitle == null) ?
			$(window).height() / 1.3  + "px" : "150px";

			// Popup body - set width is optional - append button and Ajax msg
			var popup = $("<div/>", {
				"data-role": "popup",     	 
			}).css({
				width: $(window).width() / 1.1 + "px",
				padding: 3 + "px",
				height: setHeight
			}).append(title).append(subText).append(content).append(btn);
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
			setDatePicker("#" + idx); 
}

var reservation = function(flag){
	/* 투숙일짜 초기화*/
	$("#checkinInput").val("");
	$("#checkoutInput").val("");
	/* 로그인 인증 처리*/
	$.getJSON(contextPath + '/auth/getLoginUser.ajax', 
			function(jsonObj) {
		var result = jsonObj.ajaxResult;
		if (result.status == "ok") {
			var obj = result.data;
			$.each(obj,function(index, items){
				if(index != null && items != null)
					user[index] = items;
			});
			loadRSVList(flag); 
			$("#nameType").val(user.name).css('text-align','center');
			if(user.name == "GUEST" && user.level == "NORMAL"){
				alert("회원 가입이 필요합니다.");
				location.href = contextPath + "/auth/login.html";
			}
		} else {
			alert("로그인하지 않았습니다.");
			location.href = contextPath + "/auth/login.html";
		}
	});

	var title = function(){
		$(".titleText").remove();
		$('<h3>').addClass("titleText bold")
		.text(room.name + "  객실 예약").appendTo("#title");
	}

	/* 로딩시 select options 설정*/ 
	var onSelect = function(element, value, property){
		var idx = 0;
		$(element + " option:eq(" + idx + ")").attr("selected","selected");
		$(element).prev().text(value);
		rsv.headcount = $(element +' option:selected').val();
	}

	/* 로딩시 select 선택 결과 설정 */	
	var onChange = function(element){
		$(element).change(function(){ 
			var checkin = $("#checkinInput").val();
			var checkout = $("#checkoutInput").val();

			rsv.headcount = $(element +' option').index($(element + " option:selected")) + 1;

			if(checkout!= null && checkout != ""  
				&& parseDate(checkin)[1] + parseDate(checkin)[2] <=
					parseDate(checkout)[1] + parseDate(checkout)[2])  
				confirmRSV();
		});
	}
	/* Options 생성 */
	var createOpt = function(element, data, flag){
		var makeOption = function(data){
			$(element).append($('<option>').attr('value',data).text(data));
			$("ul").trigger("create");
			$(element).prev().text(data);
		}
		if(flag == true){
			for(var i=0; i < data; i++){
				makeOption(i+1);
			}
		}else{
			makeOption(data);
		}
	}

	var removeOpt = function(element){
		$(element).contents().remove();		
	}

	function getReady(){
		removeOpt("#numberType");
		createOpt('#numberType', room.accomodate, true);		
		onSelect('#numberType', '1');
		onChange("#numberType");
	}

	title();
	getReady(); 
}

/* 오류 메세지 출력 */
function errorPage(number){
	var str2 = null;
	if(number == 0) {  //error = 0
		str2 = '통신 오류!';
	}else if(number == 1 ) { // error = 1
		str2 = '데이터를 더이상 가져올 수 없습니다.';  
	}else{
		return;
	}
	$('.errorMsg').remove();
	$('<div>').addClass('errorMsg center').append($('<h2>' + str2 + '</h2>'))
	.appendTo(content);
	$('div[data-role=content]').trigger('create'); 
}

	/* 객실 및 예약 정보 불러오기 ajax(list) */
function loadRSVList(flag){
	$.ajax(bit.contextRoot + '/reservation/list.ajax?memberNo=' + user.no +  
			'&roomNo=' + roomNo, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			if(result.status=='ok'){
				reservationCotrol(result, flag);
			}else{
//				errorPage(1); //에러메세지 출력: 출력할 데이터 없음
				console.log(result.status);
				console.log(jsonObj);
			}
		},
		error: function(xhr, status, errorThrown){
			errorPage(0); // 에러메세지: 통신 오류
			alert("통신 오류");
			console.log(status);
			console.log(errorThrown);
		}
	});	
}

/* RSV 및 Room 예약일 데이터 parsing*/
function reservationCotrol(rsvData, flag){		
	var num = 0; //카운트 변수
	/* 예약데이터가 없을 경우 3초후 이전페이지로 redirect*/

  console.log(rsvData, flag);
	$.each(rsvData.data, function(index, obj){
		if(index == "days"){ //예약 가능일
			unAvailableDates = obj;
		}
	});
}

/* 객실 및 예약 정보 불러오기 ajax(list) */
function loadRSVList(flag){
	$.ajax(bit.contextRoot + '/reservation/list.ajax?memberNo=' + user.no +  
			'&roomNo=' + roomNo, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			if(result.status=='ok'){
				reservationCotrol(result, flag);
			}else{
//				errorPage(1); //에러메세지 출력: 출력할 데이터 없음
				console.log(result.status);
				console.log(jsonObj);
			}
		},
		error: function(xhr, status, errorThrown){
			errorPage(0); // 에러메세지: 통신 오류
			alert("통신 오류");
			console.log(status);
			console.log(errorThrown);
		}
	});	
}

/* 예약 추가 ajax(insert) */
function addList(){
	$.ajax(bit.contextRoot + '/reservation/insert.ajax', {
		type: 'POST',
		dataType: 'json', 
		data: { 
			memberNo: user.no,
			roomNo: roomNo,
			headcount: Number(rsv.headcount),
			checkin: rsv.checkin,
			checkout: rsv.checkout,
			basicPrice: rsv.basicPrice
		},
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			$.mobile.changePage("#room-page");
		},
		error: function(xhr, ajaxOptions, thrownError){
			$("#showDetail").contents().remove();
			$("#showDetail").append($("<div>")
					.text("예약 실패! 예약정보를 다시 입력해주세요")
					.addClass("red bold"));
			console.log(xhr.status);
			console.log(thrownError);
		}
	});
	clearForm();
}
