var currDate = Date.today;
var getWidth = $(document).width() - 30;
var getHeight = ($(document).height())/4;
var slideWidth = getWidth/4;
var contextPath = bit.getContextRootPath(); 
var currPageNo = 1,  pageSize = 10;
var count, revIdx, currNo = 0, cntIndex = 0; 
var user = {}, room = {}, allDays = {}, allRoom = {},allRsv = {}, myDays={};
var rsv = {
		no: null, memberNo: null, roomNo: null, headcount: null, checkin: null,		
		checkout: null, basicPrice: 0, deposit: 0, discount: 0, refund: 0,
		payStatus: "N", rsvStatus: "N", refund: 0};
var result, roomNo = 1, night;
var tomorrow = new Date.today().addDays(1).toString("yyyy-MM-dd");
var todays = Date.today().toString("yyyy-MM-dd");
var seasonStart = new Date(2014, 6, 1);
var seasonEnd= new Date(2014, 7, 31);
var unAvailableDates = [];
var updateFlag = false;

$(document).ready(function(){

	/**  예약 UI  **/
	/* datepicker 공용 설정 */
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
	});

	/** 관리자용 예약 List 제어 **/
	$(document).on("scrollstart",function(){
		if($(document).height() > $(window).height())
		{
		  if($(window).scrollTop() == $(document).height() - $(window).height()
			&& cntIndex	!= 0 ){
			console.log(cntIndex, count);
		    loadList(currPageNo + 1, pageSize); //맨 하단으로 갈시 loadList를 1증가 시켜 실행
		  } 
		}
	});
	
	/** 예약 List UI **/
	/* 예약 확인창 높이 설정*/
	$("#confirmBox").css("height","300px");
	/* 예약 리스트 삭제 확인 버튼 */
	$(document).on("click", "#delete", function () {
		deleteRSVList();
	});
	/* 예약 리스트 삭제 취소 버튼*/	
	$(document).on('click','a.deleteBtn', function(){  
		popup("delete","예약취소", "확인을 누르면 예약이 취소됩니다.");
	});
	/* 예약 변경 버튼*/	
	$(document).on('click','a.changeBtn', function(event){  
		rsvUpdateControl($(this), true);
		return false;
	});
	/* 예약 변경취소 버튼*/	
	$(document).on('click','a.cancelBtn', function(){  
		rsvUpdateControl($(this), false);
		return false;
	});
	/* 예약 변경확인 버튼 */
	$(document).on('click','a.confirmBtn', function(){  
		rsvUpdateList($(this));
	});
	/* 예약날짜 팝업확인 버튼(입실,퇴실 공용)*/
	$(document).on("click", "a#confirm", function () {
		rsv.basicPrice = 0;
		var label =$("div[data-role=popup]").contents(":eq(2)").prop("id");
		$("#"+label+"-text").val($("#"+label).val());
		getAllDays(label+"-text");
	});
	
	/* 예약날짜 팝업취소 버튼(입실,퇴실 공용)*/
	$(document).on("click","a#cancel", function(){
		var label =$("div[data-role=popup]").contents(":eq(2)").prop("id");
		$("#"+label+"-text").val("");
	});
		
	$(window).trigger('resize');
	loadRoomList();
	reservation();
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
				pageControl(result);
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

	/* 방정보 처리*/
	function pageControl(result){
		$.each(result.data, function(index1,obj){		
			$.each(obj, function(index2,data){
				if(data.name){
					allRoom[index2] = []
					allRoom[index2].push(data);
				}
			});
		});
	}
}
/* 데이트피커 날짜 입력 오류처리*/
var setDatePicker = function(element){
  $(element).datepicker();
  var name = element.split("-")[2];
	var no = element.split("-")[3];

	if(name == "outdate" && $("input#rsv-input-indate-"+ no + "-text" ).val() != null &&
			$("input#rsv-input-indate-"+ no + "-text").val() != "" ){

		var minDate = $(element).datepicker( "option", "minDate" );		
		var checkMin = objDate($("#rsv-input-indate-"+ no + "-text").val()).add(1).day();//하루뒤

		if((Date.today().compareTo(checkMin)) == -1){
			$(element).datepicker("option","minDate", checkMin);
		}else{
			$(element).datepicker("option","minDate", objDate(tomorrow));
		}
	}else if($(element + "-text").val() != null && $(element + "-text").val() != "" ){
	   $(element).datepicker("setDate", $("input" + element + "-text").val()); 
	}
}
/* 날짜 배열 만들기 */
var getAllDays = function (element) { 
	var number = element.split("-")[3];
	var inDate = $("#rsv-input-indate-" + number + "-text").val();
	var outDate = $("#" + element).val();
	var first = objDate($("#rsv-input-indate-" + number + "-text").val());
	var start = objDate(inDate);
	var end = objDate(outDate).add(-1).day(); //퇴실 하루전
	var array = [], strArray = [];
  var rooms = allRoom[roomNo - 1][0];
  console.log(roomNo, allRoom);
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
			if(inDate)  $("#rsv-input-indate-" + number + "-text").val("");
			return; // 기존 예약일과 겹침
		}else{
			console.log("예약가능 : ", value);
		}
		/* 예약 정보 출력*/
		if(index == strArray.length-1 && outDate != null && outDate != ""  
			&& objDate(inDate) < objDate(outDate)){ 
			rsv.checkin = inDate;
			rsv.checkout = outDate;
			updateFlag = true;
			confirmRSV(element);
		}else{
			updateFlag = false;
//			clearForm();
		}
	});

	/* 기본 숙박비 계산(시즌,주말) */
	function Price(value){
		
		var finalPrice = function(date){
			if(value.between(seasonStart, seasonEnd) == true){
				rsv.basicPrice += (date == "weekdays") ? 
						rooms.peakWdPrice : rooms.peakWePrice;
			}else{
				rsv.basicPrice += (date == "weekdays") ? 
						rooms.offWdPrice : rooms.offWePrice;
			}
		}

		if(value.toString().substr(0,3) == "Sat" || 
				value.toString().substr(0,3) == "Sun"){
			finalPrice("weekend");
		}else{
			finalPrice("weekdays");
		}
		console.log(rsv.basicPrice);
	}

	return array;
}
/* 예약 변경 사항 저장*/
var confirmRSV = function(element){	
	console.log(element);
	var number = element.split("-")[3];
	var checkin = $("#rsv-input-indate-" + number + "-text").val();
	var checkout = $("#rsv-input-outdate-" + number + "-text").val();
	var discount = $("td#rsv-discount-" + number).text().split(" ")[0];
	var deposit = $("td#rsv-deposit-" + number).text().split(" ")[0];
	console.log(rsv.basicPrice, discount, deposit);
	var totCost = rsv.basicPrice - Number(discount) - Number(deposit);
	var rsvText = (rsv.rsvStatus == "Y") ? "예" : "아님";
	var payText = (rsv.payStatus =="Y") ? "예" : "아님";

	var showData = function(name, value){
		var tagName = $("td#rsv-" + name + "-" + number).contents().contents()
		              .prop("tagName");
		if(!tagName){
			resultText = $("td#rsv-" + name + "-" + number).text(value);
		}
	}		
	showData("lodge", night + "박 " + (night+1) + "일"); // 숙박기간
	showData("price", rsv.basicPrice+" 원"); // 기본 입실료
	showData("deposit", deposit + " 원"); // 예약금
	showData("discount", discount + " 원"); // 할인금
  showData("nopay", totCost + " 원"); // 미납급 
}
/* Date 객체 생성 함수 */
var objDate = function(date){  
	return new Date(
			// year, month, day
			parseDate(date)[0], parseDate(date)[1]-1 , parseDate(date)[2]);
}
/* YYYY-MM-DD를 파싱하여 Date 객체형으로 만들기 위한 예비함수*/
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
  var name = idx.split("-")[2];
	var num = idx.split("-")[3]; //예약 리스트 인덱스
	
	var content = $('<div>').attr("id",idx)
	.css({"margin-left":"auto","margin-right":"auto"});

	var createBtn = function(block, id, name, msg){
		return  $('<div>').addClass('ui-block-' + block)
		.append($('<a>')
				.attr({'href':'#', 'data-role':'button', 'role':'button', 'id': id, 
					'data-rel':"back"}).addClass(name).text(msg));
	}

	if(idx == "delete"){
		var btn = $('<div>').addClass("ui-grid-a")
		.css({"max-width":"98%","margin-left":"auto","margin-right":"auto"})
		.append(createBtn('a', "delete", "delete-btn",'확인'))
		.append(createBtn('b', "", "",'취소'));
	}else{
		var btn = $('<div>').addClass("ui-grid-a")
		.css({"max-width":"340px","margin-left":"auto","margin-right":"auto"})
		.append(createBtn('a', "confirm", "confirm-" + name + "-" + num , '확인'))
		.append(createBtn('b', "cancel", "cancel-" + name + "-" + num , '취소'));
	}

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

      if(idx != "delete") unAvailableList(num);
			
			$("[data-role=popup]").trigger('create');
			if(idx != "delete") setDatePicker("#" + idx); 
} 

/* 예약 List main 함수*/
function reservation(flag){
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
			if(user.level == "NORMAL"){
				loadRSVList();//일반사용자 예약 List ajax 호출 
			}else if(user.level == "ADMIN"){
				loadAllRsvList(1, pageSize); //전체 예약 List ajax 호출
			}
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
}

/* 고객별 예약 정보 불러오기 ajax(list) */
function loadRSVList(flag){
	$.ajax(bit.contextRoot + '/reservation/list.ajax?memberNo=' + user.no +  
			'&roomNo=' + roomNo, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			if(result.status=='ok'){
				$('.errorMsg').remove(); //기존 오류메세지 다 삭제
				reservationControl(result);
			}else{
				errorPage(1); //에러메세지 출력: 출력할 데이터 없음
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

/* 전체 예약 정보 불러오기 ajax(list) */
function loadAllRsvList(pageNo, pageSize){
	$.ajax(bit.contextRoot + '/reservation/allList.ajax?pageNo=' + pageNo +  
			'&pageSize=' + pageSize, {
		type: 'POST',
		dataType: 'json', 
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			count = result.data.count;
			if(result.status=='ok' && result.data.allList.length > 0){
				$('.errorMsg').remove(); //기존 오류메세지 다 삭제
				reservationControl(result);
				currPageNo = pageNo;
				loadingBar();
			}else{
        errorPage(1); //에러메세지 출력: 출력할 데이터 없음
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
/* 제외할 예약일 생성*/
function unAvailableList(num){
	unAvailableDates = []; //예약일 배열 초기화

	function getArray(index){
	 var first = objDate(myDays[index][0]);
	 var start = objDate(myDays[index][0]);
	 var end = objDate(myDays[index][1]);
	 var array = [], strArray = [];

	 array.push(first);
		 while(start < end) {
		array.push(start);
		start = new Date(start.setDate(
				start.getDate() + 1
		  ))
		}
		$.each(array, function(index,value){
		  strArray[index] = value.toString("yyyy-MM-dd");
	  });
		return strArray;  
	} 
	
	var obj = allRsv[num];
	var checkVal = obj.rsvStatus;
	
	if(checkVal == "Y") {
		var exception = getArray(obj.no); // 예약일 - 내 예약일
		exception.pop(); // 마지막 날짜 제거
	}
	/* 최종 예약일 필터*/
	if(allDays[obj.roomNo] != undefined){ //방별 예약일이 유효할때만(not undefined)
		rsvday = allDays[obj.roomNo];		
		
		$.each(rsvday, function(index,value){
		  if($.inArray(value, exception) != -1 && checkVal == "Y"){//-1 : 두 값이 동일하지 않음
			  console.log(value, exception, $.inArray(value, unAvailableDates));
		  }else{
		  	unAvailableDates.push(value);
		  }
	  });
	}
}

/* 내 예약일 배열 생성*/
function getMyDays(flag){
	
	var getDate = function(){
  	myDays[rsv.no] = [];
  	myDays[rsv.no].push(rsv.checkin);
  	myDays[rsv.no].push(rsv.checkout);
	}
	
  if(flag == true && rsv.memberNo == user.no){ //일반사용자(자신의 데이터만)
  	getDate();
  }else if(flag == false){ // 관리자(전체)
  	getDate();
  }
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
	$('<div>').addClass('errorMsg center').append($('<h3>' + str2 + '</h3>'))
	.css({"margin-top":"50%", "margin-bottom":"auto"})
	.appendTo('div[data-role=content]');
	$('div[data-role=content]').trigger('create'); 
}

/* RSV 및 Room 예약일 데이터 parsing*/
function reservationControl(rsvData){		
	var num = 0; //카운트 변수
	/* 예약데이터가 없을 경우 3초후 이전페이지로 redirect*/
	var rsvNull = function(){
		$("<div>").addClass("rsvRow bold red")
		.css({"height": $(document).height()/1.8 + "px"})
		.append($("<div>").text(user.name + "님의 예약사항이 없습니다.")
				.css({ "display":"inline-block","margin-top":"40%"}))
				.appendTo("div[data-role=content]");

		setTimeout(function() {
			$(".rsvRow").remove();
			$.mobile.changePage("#room-page"); 
		}, 3000);
	}
	
  console.log("Test1", rsvData);
	$.each(rsvData.data, function(index, obj){
	 if(index == "list" || index == "allList"){ //예약확인 시만
			if(obj.length == 0){ 
				rsvNull(); 
			}else{
				$.each(obj, function(index, value){ // 이용자의 전체 예약정보 배열 생성	
					allRsv[index] = value;
					$.each(value, function(index2, value2){
						rsv[index2] = value2; // 예약정보 배열 생성
						if(user.level == "ADMIN" && index2 == "rsvStatus"){
							if(value2 == "Y") getMyDays(false);
						}else if(index2 == "userName"){
							getMyDays(true);							
						}
					});
					showConfirmData(num++);
				});
			}
		}else if(index == "rsvDays"){ //방별 예약일 배열 생성
      $.each(obj, function(index, value){
    		allDays[index] = [];
      	$.each(value, function(index2, value2){
          allDays[index].push(value2);
      	});
      });	
		}
	});

	/* 예약확인시 예약 관련 데이터 생성 함수*/
	function showConfirmData(num){ 
		if(rsv.rsvStatus == "Y"){ //예약일 경우
			mark = 'text-answer remove-shadow'; 
			str = '예약';
		}else{ // 그외 
			mark = 'text-no-answer';
			str ='대기';
		}

		if(num == 0){
			if(user.level == "ADMIN"){
				nameText = "관리자 전용";
			}else if(user.level == "NORMAL"){
				nameText = "예약자 : " + user.name;
			}
			var subTitle = $("<div>").text(nameText)
			.addClass("rsvRow top-mg-01 bottom-mg-02")
			.appendTo('div[data-role=content]');
		}

		var colText = (num == 0) ? "false": "true";
		var rsvRow = $("<div>").addClass("rsvRow").attr({
			"data-role":"collapsible", 
			"data-theme":"a",
			"data-content-theme":"a",
			"data-iconpos" : "left", 
			"data-collapsed-icon" : "carat-d", 
			"data-expanded-icon" : "carat-u",
			"id" : "rsv-" + num, 
			"data-collapsed" : colText
		});

		var showDate = function(data, flag){
			var date = data.substr(0,10);
			var dateText;
			if(flag == true){
				dateText = parseDate(date)[0] + "년 " + parseDate(date)[1] 
				+ "월 " + parseDate(date)[2] + "일";
			}else{
				dateText = parseDate(date)[1] + "월 " + parseDate(date)[2] + "일";
			}
			return dateText;
		}

		var title = $('<h3>').text(showDate(rsv.checkin, false)+ " "+ rsv.roomName)
		.append($('<div>' + str + '</div>').addClass(mark));

		var listShow = function(){
			var totCost = rsv.basicPrice - rsv.discount -rsv.deposit;
			var rsvText = (rsv.rsvStatus == "Y") ? "예" : "아님";
			var payText = (rsv.payStatus =="Y") ? "예" : "아님";
			rsv.refund = (rsv.payStatus == "Y") ? (rsv.deposit + totCost) : rsv.deposit;

			var start = objDate(rsv.checkin.substr(0,10)).getTime();
			var end = objDate(rsv.checkout.substr(0,10)).getTime();
			var getNight = (end - start)/ 1000 / 60 / 60 / 24;

			var rsvDay = Date.today().toString("yyyy-MM-dd"); 

			var tableData = function(name, value, clazz){
				return   $("<tr>").append($("<td>").text(name).addClass("rsv-label"))
				.append($("<td>").text(value).attr("id","rsv-" + clazz + "-" + num));
			}

			if(user.level == "NORMAL"){
				
				var table = $("<table>").addClass("rsv-table table-" + num)
				.append(tableData("예약번호", rsv.no, "no"))
				.append(tableData("예약여부", rsvText, "rsv"))
				.append(tableData("예약일", showDate(rsv.date,true), "date"))
				.append(tableData("방이름", rsv.roomName, "name"))
				.append(tableData("숙박인원", rsv.headcount + " 명", "number"))
				.append(tableData("입실날짜", rsv.checkin, "indate"))
				.append(tableData("퇴실날짜", rsv.checkout, "outdate"))
				.append(tableData("숙박기간", 
						getNight + "박 " + (getNight+1) + "일", "lodge"))
						.append(tableData("기본 입실료", rsv.basicPrice + " 원", "price"))
						.append(tableData("예약금", rsv.deposit + " 원", "deposit"))
						.append(tableData("할인료", rsv.discount + " 원", "discount"))
						.append(tableData("총결제 예정금액", totCost + " 원", "nopay"))
						.append(tableData("완납여부", payText, "status"));
				
			}else if(user.level == "ADMIN"){
				
				var table = $("<table>").addClass("rsv-table table-" + num)
				.append(tableData("예약번호", rsv.no, "no"))
				.append(tableData("예약자", allRsv[num].userName, "userName"))
				.append(tableData("예약여부", rsvText, "rsv"))
				.append(tableData("예약일", showDate(rsv.date,true), "date"))
				.append(tableData("방이름", rsv.roomName, "name"))
				.append(tableData("숙박인원", rsv.headcount + " 명", "number"))
				.append(tableData("입실날짜", rsv.checkin, "indate"))
				.append(tableData("퇴실날짜", rsv.checkout, "outdate"))
				.append(tableData("숙박기간", 
						getNight + "박 " + (getNight+1) + "일", "lodge"))
						.append(tableData("기본 입실료", rsv.basicPrice + " 원", "price"))
						.append(tableData("예약금", rsv.deposit + " 원", "deposit"))
						.append(tableData("할인료", rsv.discount + " 원", "discount"))
						.append(tableData("완납여부", payText, "status"));
				
			}
			var msg = $("<div>").text("< 객실은 변경할수 없습니다. >")
			.addClass("center small top-mg-01");

			var contents = $('<ul>').attr("data-role","listview")
			.append($("<li>").append($("<div>").append(table).append(msg)));

			rsvRow.append(title).append(contents).appendTo("div[data-role=content]");
			rsv.refund = totCost;
			uiCreate("init", num);
		}
		
		listShow();  
	}
	$('div[data-role=content]').trigger('create'); // 화면갱신
}

/* 페이지 이동시 예약정보 제거(rsvRow) */
function clearList(){ 
	$(".rsvRow").remove();
	loadRoomList();
}

/* 예약 변경 ajax(update) - 일반, 관리자 공용 */
function deleteRSVList(){
	console.log(rsv.no, user.no, room.no);

	$.ajax(bit.contextRoot + '/reservation/delete.ajax', {
		type: 'POST',
		dataType: 'json', 
		data: { 
			no: rsv.no,
			memberNo: user.no,
			roomNo: rsv.roomNo
		},
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			if(result.status=='ok'){
				$(".rsvRow").remove();
				location.href = 'mobile_rsv_list.html';
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

/* 변경, 삭제 버튼 생성 */
function uiCreate(flag, num, element){
	var btn = function(block, msg, str){
		return $('<div>').addClass('ui-block-' + block)
		.append($('<a>').attr({ 'href':'#', 'data-role':'button'})
		.addClass(str).text(msg));
	}
	
	if(flag == "init"){ // 처음
		$('<div>').addClass('ui-grid-a ui-crud-btn btn-'+ num)
		.append(btn('a', '변경', 'changeBtn btn-'+num))
		.append(btn('b', '삭제', 'deleteBtn btn-'+num).attr('data-transition','pop'))
		.appendTo($(".rsvRow").contents(":last"));
	}else if(flag == true){  //취소버튼을 누를경우
		$("div.btn-" + num).remove();
		$('<div>').addClass('ui-grid-a ui-crud-btn btn-'+num)
		.append(btn('a', '변경', 'changeBtn btn-'+num))
		.append(btn('b', '삭제', 'deleteBtn btn-'+num).attr('data-transition','pop'))
		.appendTo($("div#rsv-" + num).contents(":last"));
	}else{ // 변경 버튼 누를 경우
		$("div.btn-" + num).remove();
		$('<div>').addClass('ui-grid-a ui-crud-btn btn-'+num)
		.append(btn('a', '확인', 'confirmBtn btn-'+num))
		.append(btn('b', '취소', 'cancelBtn btn-'+num))
		.appendTo($("div#rsv-" + num).contents(":last"));
	}
	$('div[data-role=content]').trigger('create'); // 화면갱신
}

/* 예약 변경 제어 함수*/
function rsvUpdateControl(element, flag){	

  var num = element.attr("class").split(" ")[1].split("-")[1];
  var pos = $("div#rsv-"+num);
	var listVal = function(property){
		  return allRsv[num][property];
	}
  roomNo = allRsv[num]["roomNo"];
	var rooms = allRoom[roomNo - 1][0];
	console.log(roomNo, rooms);
	/* 변경을 위한 입력상태 */
	function rsvUICreate(name, value, atr, atr2){
		var node = "td#rsv-" + name +  "-" + num;
		$(node).text("");
		$("<input>").css("text-align","center")
		.val(value).attr({"type":"text",
			                 "id":"rsv-input-"+name+"-"+num+"-text", "onfocus":atr,
			                 "readonly" : atr2})
		.appendTo($(node));
		$(node).trigger("create");
	}
    /* 초기 상태 */
	function rsvInit(name, property, flag, data){
		var node = "td#rsv-" + name +  "-" + num; 
		$(node).contents().remove();
    if(flag == true){
    	if(data == "Y") $(node).text("예");
    	else $(node).text("아니오");
    }else{
  		$(node).text(listVal(property));
    }
	}
	
	/* 변환전 TD값 저장*/
	 var tdNumber = allRsv[num]["accomodate"];
	 var tdRsv = allRsv[num]["rsvStatus"];
	 var tdPay = allRsv[num]["payStatus"];
	 var init = allRsv[num]["headcount"];
	 
  /* 옵션 생성 함수*/
	 function rsvOptCreate(element, flag, data){
	   $("td#rsv-" + element +  "-" + num).text(""); //td객체 
		 var newElement = "#rsv-input-" + element + "-" + num + "-text"; //input 객체
		   $(newElement).remove();	

		 var select =  $("<select>")
		 .attr({"id":"rsv-select-" + newElement.split("-")[2] + "-" + num,
			 "data-role":"none"})
			 .css({"height":"25px", "width" : $("td#rsv-" + newElement.split("-")[2] + 
					 "-" + num).width(),"text-indent" : getWidth/5 + "px"});
		 
		 if(flag == "number"){
			 var makeOption = function(data){
				 $('<option>').attr('value', data).text(data).appendTo(select);
			 }
			 for(var i=0; i < data; i++){ makeOption(i+1);}
			 select.appendTo("td#rsv-" + newElement.split("-")[2] + "-" + num);
		 }else if(flag == "boolean"){
			 $('<option>').attr('value', "Y").text("예").appendTo(select);
			 $('<option>').attr('value', "N").text("아니오").appendTo(select);
			 select.appendTo("td#rsv-" + newElement.split("-")[2] + "-" + num);
		 }
		 
		 var selElement = "select#rsv-select-" + newElement.split("-")[2] + "-" + num;
		 if(flag == "number"){
			 $(selElement).val(init); 
		 }else{
			 $(selElement).val(data);
		 }
	 }
	  
	if(flag == true){ //변경 상태
		rsvUICreate("number", listVal("headcount"));
		rsvUICreate("indate", listVal("checkin"),
				     "popup('rsv-input-indate-" + num + "','입실 날짜')", "readonly");
		rsvUICreate("outdate", listVal("checkout"),
            "popup('rsv-input-outdate-" + num + "','퇴실 날짜')", "readonly");
		rsvOptCreate("number","number", tdNumber);
		
		if(user.level == "ADMIN"){
			rsvUICreate("deposit", listVal("deposit"));
			rsvUICreate("discount", listVal("discount"));
			rsvOptCreate("rsv","boolean", tdRsv);
			rsvOptCreate("status","boolean", tdPay);
		}
	  uiCreate(false, num, element);
	  
	}else	if(flag == false){ //취소상태
		rsvInit("number", "headcount");
		rsvInit("indate", "checkin");
		rsvInit("outdate", "checkout");
		rsvInit("price", "basicPrice");
		$("td#rsv-nopay-" + num).contents().remove();
		$("td#rsv-nopay-" + num).text(
				allRsv[num]["basicPrice"] - allRsv[num]["deposit"] - allRsv[num]["discount"]);
		rsvInit("name", "roomName");
		rsvInit("deposit", "deposit");
		rsvInit("discount", "discount");
		rsvInit("rsv", "rsvStatus", true,tdRsv);
		rsvInit("status", "payStatus", true, tdPay);
	
	  uiCreate(true, num, element);
	}
}
/* 변경사항 전송*/
function rsvUpdateList(element){
	var number = element.attr("class").split(" ")[1].split("-")[1];
	var getData = function(name){
			return $("td#rsv-" + name + "-" + number).text();
	}		
	
	var rsvdata = allRsv[number];
	
	var getRsvData = function(){	//rsv변수를 임시 저장변수로 사용		
	
		var getVal = function(name){
			return $("#rsv-input-" + name + "-" + number + "-text").val();
		}
		
		var getOpt = function(name, flag){
			var opt = "select#rsv-select-" + name + "-" + number
      var optVal = $(opt + " option").index($(opt + " option:selected ")) +1;
			if(flag == true) optVal =	$(opt).val();
			return optVal;
		}
		
		rsv.no = Number(rsvdata.no); //예약번호
    rsv.memberNo = Number(rsvdata.memberNo); //회원번호
    rsv.roomNo = Number(rsvdata.roomNo); //방번호
    rsv.headcount = Number(getOpt("number")); //숙박인원
    rsv.basicPrice = Number(getData("price").split(" ")[0]); //기본가
		rsv.checkin = getVal("indate") //입실
		rsv.checkout = getVal("outdate") //퇴실
	  rsv.discount = Number(getVal("discount")) //할인료
	  rsv.deposit = Number(getVal("deposit")) //예약금
	  rsv.rsvStatus = getOpt("rsv", true); //예약
	  rsv.payStatus = getOpt("status", true) //납부상태
	  if(Number(getVal("deposit")) > 0  && getOpt("status", true) == "N" ){
	  	rsv.refund = Number(getVal("deposit"));
	  }
	  if(getOpt("status", true) == "Y"){
	  	rsv.refund = Number(getData("price").split(" ")[0]) - 
	      Number(getVal("deposit")) - Number(getVal("discount"));
	  }
	}	

	function insertList(){
		$.ajax(bit.contextRoot + '/reservation/update.ajax', {
			type: 'POST',
			dataType: 'json', 
			data: { 
				no: rsv.no,
				memberNo: rsv.memberNo,
				roomNo: rsv.roomNo,
				headcount: rsv.headcount,
				checkin: rsv.checkin,
				checkout: rsv.checkout,
				basicPrice: rsv.basicPrice
			},
			success: function(jsonObj){
				var result = jsonObj.ajaxResult;
				if(result.status == "ok"){
					location.href = "mobile_rsv_list.html"; 
				}else{
					alert("예약변경 실패");
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				console.log(xhr.status);
				console.log(thrownError);
			}
		});
	}
	
	function insertAllList(){
		$.ajax(bit.contextRoot + '/reservation/allUpdate.ajax', {
			type: 'POST',
			dataType: 'json', 
			data: { 
				no: rsv.no,
				memberNo: rsv.memberNo,
				roomNo: rsv.roomNo,
				headcount: rsv.headcount,
				checkin: rsv.checkin,
				checkout: rsv.checkout,
				basicPrice: rsv.basicPrice,
				deposit : rsv.deposit,
				discount : rsv.discount,
				payStatus: rsv.payStatus,
				rsvStatus: rsv.rsvStatus,
				refund: rsv.refund
			},
			success: function(jsonObj){
				var result = jsonObj.ajaxResult;
				if(result.status == "ok"){
					location.href = "mobile_rsv_list.html"; 
				}else{
					alert("예약변경 실패");
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				console.log(xhr.status);
				console.log(thrownError);
			}
		});
	}
	getRsvData();
	console.log(rsv);
	console.log(user.level);
	if(user.level == "NORMAL"){ 
		insertList();	
	}else if(user.level == "ADMIN"){
		insertAllList();
	}
}

/* 10개 출력후 다음 출력을 위해서 로딩바 표시 및 제어 함수*/
function loadingBar(){
	
	var finalBar = function(msg, func){
	  $('.loader').remove();
	  $("<button>").text(msg).addClass('top-loader center')
	  .attr("onclick", func).appendTo('div[data-role=content]');  
	  $('div[data-role=content]').trigger('create'); 
	  cntIndex = (cntIndex >=  count) ? 0 : cntIndex;
	}
	
	var infiniteIcon = function(){
		$('.loader').remove();
		$('<div>').addClass('loader center ui-nodisc-icon')
		.append($('<a>').attr('href','#').addClass('ui-disabled')
		.addClass(pageDownStr)).appendTo('div[data-role=content]');
		$('div[data-role=content]').trigger('create');  //refresh(부모에 할것)
	}
	
	if(user.level == "ADMIN" && cntIndex == count){ //처음으로 가기 
		finalBar("처음으로 이동","reset()");
	}else if(user.level == "ADMIN" && cntIndex >= pageSize){ //더 출력할 컨텐츠가 있음을 아이콘으로 알려줌
		infiniteIcon();
	}
}

/* 초기화 함수 + LoadList(1)호출 */
function reset(){
	$('.dataRow').remove();
	$('.top-loader').remove();
	$('.loader').remove();
	cntIndex = 0; //counter 카운트 초기화
  loadList(1, pageSize);
} 
