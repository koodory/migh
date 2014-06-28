var currDate = Date.today;
var getWidth = $(document).width() - 30;
var getHeight = ($(document).height())/4;
var slideWidth = getWidth/4;
var contextPath = bit.getContextRootPath(); 
var count, currNo = 0, fisrtNo = 0;
var user = {};
var room = {};
var rsv = {
  no: null, memberNo: null, roomNo: null, headcount: null, checkin: [],		
  checkout: [], basicPrice: null, deposit: null, discount: null,
  payStatus: null, rsvStatus: null, refund: null, payStatus: null,
  rsvStatus: null, refund: null
};
var result, roomNo = 1;
var count;
var tomorrow = new Date.today().addDays(1).toString("yyyy-MM-dd");
var todays = Date.today().toString("yyyy-MM-dd");
var seasonStart = new Date(2014, 6, 1);
var seasonEnd= new Date(2014, 8, 31);
var unAvailableDates = 
	['2014-07-01', '2014-07-04', '2014-07-05', '2014-06-30',
	 '2014-07-07', '2014-07-09', '2014-07-13', '2014-07-14', '2014-07-25',
	 '2014-07-26'];

$(function(){
	$('.slide-main-space').css('width',getWidth).css({
		'height':getHeight,
		'margin-bottom': '-7px'
	});
	$('.image-size').css('max-height',getHeight);

	$('#imageGallery').lightSlider({
		gallery:true,
		minSlide:1,
		maxSlide:1,
		currentPagerPosition:'left'  
	});  
	
	$('#prevBtn').click(function(){
		moveBackward();
	});
	
	$('#nextBtn').click(function(){
		moveFoward();
	});
	
	$(window).trigger('resize');
	
	function touchCreate(){
		$(document).on('swipeleft','div#touch-area',function(){
			moveBackward();
		});
		
		$(document).on('swiperight','div#touch-area',function(){
			moveFoward();
		});
	}
	
	function pageControl(roomNo){
		var num=0, index=0, data, cnt=new Array();
		$.each(result.data, function(index1,obj){		
			$.each(obj, function(index2,data){
				if(data.count){
					cnt[index2] = data.count;
				}
				if(data.no == roomNo){
					showData(data, index2, cnt);
					if(data.picPath){
						showPic(data, num++, true);
					}else if(!data.picPath){
						imageCheck(data);
					}
				}
			});	
		});		

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

		function showData(data, index2, cnt){
			roomNo = data.no;

			var title = function(name){
				if(data.name){
					$(name).contents().remove();
					$('<h3>').text(data.name)	
					.addClass('ui-title bold').attr('aria-level','1')
					.appendTo(name);
				}
			}

			title('div[data-role=header]'); //방이름 변경

			$('.dataRow').remove();
			$.each(data, function(index, value){
				room[index] = value; // 현재 방 정보 저장
				$('<span>').addClass('dataRow').append(value).appendTo('#'+index); 
			})
//			console.log(room);
		}

		function imageCheck(data){ //오류처리
			flag = true;
			if(data.count < 4){
				var index = data.count;
				for(var i=index; i< 4; i++){
					showPic(data, i, false);
				}
			}
		}
	}
	
	function moveFoward(){
		roomNo++;
		if (roomNo > count) {
			roomNo = 1; pageControl(roomNo);
		}else{
			pageControl(roomNo);
		}
	}

	function moveBackward(){
		roomNo--;
		if (roomNo < 1) {
			roomNo = count; pageControl(roomNo);
		}else{
			pageControl(roomNo);
		}
	}
	
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
	
	$.datepicker.setDefaults({ //datepicker 예약일 표시
		minDate: "+0d",
		beforeShowDay: function(date) {
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
		dayNamesMin: [ "월", "화", "수", "목", "금", "토", "일" ],
		showAnim: "slideDown"
	});
	
	$(document).on("click", ".confirm-date", function () {
	  var label =$("div[data-role=popup]").contents(":eq(2)").prop("id");
	  $("#"+label+"Input").val($("#"+label).val());
	  
//	   function validate(){
//		if($("#checkinInput").val()) var checkin = objDate($("#checkinInput").val());
//		if($("#checkoutInput").val())  var checkout = objDate($("#checkoutInput").val());	
//		if($("#checkinInput").val()) console.log(checkin.between(seasonStart, seasonEnd));
//		if($("#checkoutInput").val())  console.log(checkout.between(seasonStart, seasonEnd));
//	   }	
//	   validate();
       getAllDays();
	   
	});

	$(document).on("click",".cancel-date", function(){
	  var label =$("div[data-role=popup]").contents(":eq(2)").prop("id");
	  $("#"+label+"Input").val("");
    });

	loadRoomList();
	touchCreate();
});

/* 날자 배열 만들기 */
var getAllDays = function () { 
	var first = objDate($("#checkinInput").val());
    var start = objDate($("#checkinInput").val());
    var end = objDate($("#checkoutInput").val()).add(-1).day(); //퇴실 하루전
    var array = [], strArray = [];
    var rsvFlag = true;

    array.push(first);
    
    while(start < end) {
        array.push(start);
        start = new Date(start.setDate(
            start.getDate() + 1
        ))
    }
    /* 예약일을 Date객체 배열로 변환*/
    $.each(array, function(index,value){
    	console.log(array);
        strArray[index] = value.toString("yyyy-MM-dd");
    });
    
    /* 기존예약일과 겹치는지 검사 */
    $.each(strArray, function(index,value){
    	if($.inArray(value, unAvailableDates) != -1){ //-1 : 두 값이 동일하지 않음
    		if($("#checkoutInput").val()) $("#checkoutInput").val("");
    		return; // 기존 예약일과 겹침
    	}else{
        	console.log("예약가능 : ", value);
        	console.log(room);
            weekPrice();
            seasonPrice();
    	}
    });
    
    function weekPrice(){
    	
    }
    
    function seasonPrice(){
    	
    }
    
//    if(start.toString().substr(0,3) == sat || start.toString().;
   
    return array;
};

var objDate = function(date){ //Date 객체 생성 함수	  
	  return new Date(
	   // year, month, day
	   parseDate(date)[0], parseDate(date)[1]-1 , parseDate(date)[2]);
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
	}else if($(element + "Input").val() 
			 != null && $(element + "Input").val() != "" ){
		$(element).datepicker("setDate", $(element+"Input").val()); 
	}
}

function popup(idx, message) {
	// text you get from Ajax  
	var closeBtn = $("<a>").attr({"href":"#", "data-rel":"back"})
	.addClass("ui-btn-right ui-btn ui-btn-b ui-corner-all " +
	"ui-btn-icon-notext ui-icon-delete ui-shadow");

	var title = $('<h3>').text(message).addClass("center");

	var content = $('<div>').attr("id",idx)
	.css({
		"margin-left":"auto",
		"margin-right":"auto"
	});

	var createBtn = function(block, id, name, msg){
		return  $('<div>').addClass('ui-block-' + block)
		.append($('<a>')
				.attr({'href':'#', 'data-role':'button', 'role':'button',
					'id': id, 'data-rel':"back"})
					.addClass(name).text(msg));
	}

	var btn = $('<div>').addClass("ui-grid-a")
	.append(createBtn('a','confirm','confirm-date','확인'))
	.append(createBtn('b','cancel','cancel-date','취소'));

	// Popup body - set width is optional - append button and Ajax msg
	var popup = $("<div/>", {
		"data-role": "popup",     	 
	}).css({
		width: $(window).width() / 1.1 + "px",
		padding: 3 + "px",
		height: $(window).height() / 1.3  + "px"
	}).append(closeBtn).append(title).append(content).append(btn);
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

	if(idx =="checkin") setDatePicker("#checkin");
	else setDatePicker("#checkout");
}

var reservation = function(){	
   $.getJSON(contextPath + '/auth/getLoginUser.ajax', 
	   function(jsonObj) {
		var result = jsonObj.ajaxResult;
		if (result.status == "ok") {
			var obj = result.data;
			$.each(obj,function(index, items){
				if(index != null && items != null)
                   user[index] = items;
			});
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
		property = $(element +' option:selected').val();
	}
		
    /* 로딩시 select 선택 결과 설정 */	
	var onChange = function(element, prop1, prop2){
		$(element).change(function(){
			prop1 =  $(element +' option:selected').val();
			prop2 = $(element +' option').index($(element + " option:selected")) + 1;
			if(element == '#roomType'){
				removeOpt('#numberType');
				createOpt('#numberType', room[prop2].accomodate, true);
				onSelect('#numberType', '1명');
			}
			alert("테스트");
			getRsvData();
		});
	}
	
	var createOpt = function(element, data, flag){
		var makeOption = function(data){
		  $(element).append($('<option>').attr('value',data).text(data));
		  $("ul").trigger("create");
		  $(element).prev().text(data);
		}
		
		if(flag == true){
		  for(var i=0; i < data; i++){
			  makeOption((i+1)+"명");
		  }
		}else{
		  makeOption(data);
		}
	}
    
	var removeOpt = function(element){
	  $(element).prev().text("");
      $(element).contents().remove();		
	}
			
	function getReady(){
		createOpt('#numberType', room.accomodate, true);		
        onSelect('#numberType', '1명');
	}
	
	function getRsvData(){
		$.each(rsv, function(index, value){
		  console.log(index, value);	
		});
	}
	
	function onChangeFnc(){
		onChange("#roomType");
		onChange("#numberType");
	}
	
	$('#checkInType').focus(function(){
		$(".ui-datepicker-close").addClass("ui-btn-right ui-btn ui-btn-b " +
		  "ui-corner-all ui-btn-icon-notext ui-icon-delete ui-shadow");
	});
			
	title();
	getReady(); 
}
