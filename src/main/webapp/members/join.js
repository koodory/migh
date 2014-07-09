//var date = new Date();
//var month = date.getMonth()+1;
//if(month  < 10){ month = '0' + month;}
//var currDate = date.getFullYear() + '-' + month + '-' + date.getDate(); 
var membership = 'NORMAL';
var status = 'Y';
var flag = false;
var pw_flag = false;
var tot_flag = false;
var id = $('#id');
var pw = $('#password');

function id_check(){
	var label = $('#td-id');

	if(id.val().length > 0){
		$.ajax(bit.contextRoot + '/auth/getLoginId.ajax', {
			type: 'POST',
			dataType: 'json', 
			data: { 
				id: $('#id').val()
			},
			success: function(jsonObj){
				var result = jsonObj.ajaxResult;
				if (result.status == "ok" && result.data == "success") {
					label.contents().remove();
					label.append("<span>아이디 생성 가능</span>");
					label.contents().first().addClass('label-alarm');
					flag = true; btnPress();
				} else {
					label.contents().remove();
					label.append("<span>아이디 생성 불가</span>");
					label.contents().first().addClass('label-alarm red');
					flag = false; btnPress();
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				alert("통신 장애");
				console.log(xhr.status);
				console.log(thrownError);
				flag = false; btnPress();
			}
		});	
	}else{
		label.contents().remove();
		label.append("<span>아이디를 입력하세요</span>");
		label.contents().first().addClass('label-alarm');
		flag = false; btnPress();
	}
}

function email_check(){
	var label = $('#td-email');
	$.ajax(bit.contextRoot + '/auth/getLoginEmail.ajax', {
		type: 'POST',
		dataType: 'json', 
		data: { 
			email: $('#email').val()
		},
		success: function(jsonObj){
			var result = jsonObj.ajaxResult;
			if (result.status == "ok" && result.data == "success") {
				label.contents().remove();
				label.append("<span>이메일 생성 가능</span>");
				label.contents().first().addClass('label-alarm');
				flag = true; btnPress();
			} else {
				label.contents().remove();
				label.append("<span>이메일 생성 불가</span>");
				label.contents().first().addClass('label-alarm red');
				flag = false; btnPress();
			}
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert("통신 장애");
			console.log(xhr.status);
			console.log(thrownError);
			flag = false; btnPress();
		}
	});	
}

function pw_dup_check(){
	var pw2 = $('#password2')
	var label = $('#td-pw2');

	if(pw.val() == pw2.val() &&
			pw.val().length > 0 && pw2.val().length > 0){
		if(pw_flag == true){
			label.contents().remove();
			label.append("<span>암호를 사용할 수 있습니다.</span>");
			label.contents().first().addClass('label-alarm blue');
			flag = true; btnPress();
		}else{	
			label.contents().remove();
			label.append("<span>입력한 암호가 서로 일치</span>");
			label.contents().first().addClass('label-alarm');
			flag = false; btnPress();
		}
	}else{
		label.contents().remove();
		label.append("<span>입력한 암호가 서로 다름</span>");
		label.contents().first().addClass('label-alarm red');
		flag = false; btnPress();
	}
}

function pw_comp_check(){
	var label = $('#td-pw1');

	if(id.val() == ''){
		label.contents().remove();
		label.append("<span>아이디를 먼저 입력해 주십시오.</span>");
		label.contents().first().addClass('label-alarm red');
		flag = false; pw_flag = false; btnPress();
		pw.val(""); 
	}else if(pw.val().indexOf(id.val()) >= 0) {
		label.contents().remove();
		label.append("<span>아이디를 암호에 사용할 수 없습니다.</span>");
		label.contents().first().addClass('label-alarm red');
		pw.val(""); 
		flag = false; pw_flag = false; btnPress();
	}else if(!pw.val().match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)
			|| pw.val().length < 6){
		label.contents().remove();
		label.append("<span>비밀번호는 문자, 숫자, 특수문자의 조합으로</span><br>" +
		"<span>6 ~ 20자리로 입력해주세요.</span><br>");
		label.contents().first().addClass('label-alarm red');
		flag = false; pw_flag = false; btnPress();
	}else{
		label.contents().remove();
		label.append("<span>사용가능한 암호입니다.</span>");
		label.contents().first().addClass('label-alarm blue');
		flag = true; pw_flag = true; btnPress();
	}
}	

function tel_check(){
	var tel = $('#telephone');
	var label = $('#td-tel');
	var len = tel.val().length;
	var str = tel.val();

	if (((event.keyCode<48) || (event.keyCode>57)) && !(event.keyCode == 8)){
		event.returnValue=false;
		label.contents().remove();
		label.append("<span>숫자만 입력가능</span>");
		label.contents().first().addClass('label-alarm red');
		tel.val(""); 
		flag = false; btnPress();
	}else if(len >= 9 && event.keyCode != 8){
		if(str.substr(0,2) == '02' && len == 9){
			tel.val(str.substr(0,2)+'-'+str.substr(2,3)+'-'+str.substr(len-4));
		}else if(str.substr(0,2) == '02' && len >= 10 && len <= 12){
			tel.val(str.substr(0,2)+'-'+str.substr(3,3)+str.substr(7,1)+
					'-'+str.substr(len-4));		 
		}else if(str.substr(0,2) != '02' && len == 10){
			tel.val(str.substr(0,3)+'-'+str.substr(3,3)+'-'+str.substr(len-4));
		}else if(str.substr(0,2) != '02' && len >= 11 && len <= 13){
			tel.val(str.substr(0,3)+'-'+str.substr(4,3)+str.substr(8,1)+
					'-'+str.substr(len-4));	
		}
	}else if(len >=9 && event.keyCode == 8){
	    if(str.substr(0,2) == '02' && len == 11){
			tel.val(str.substr(0,2)+'-'+str.substr(3,3)+'-'+
					str.substr(6,1) + str.substr(len-3));
		}else if(str.substr(0,2) == '02' && len <=10 ){
			tel.val(str.substr(0,2)+str.substr(3,3)+str.substr(len-3));
			
		}else if(str.substr(0,2) != '02' && len == 12){
			tel.val(str.substr(0,3)+'-'+str.substr(4,3)+'-'+
					str.substr(7,1) + str.substr(len-3));
		}else if(str.substr(0,2) != '02' && len <=11){
			tel.val(str.substr(0,3)+str.substr(4,3)+str.substr(len-3));
		}
	}else{
		label.contents().remove();
		label.append("<span>유효 전화번호 자리수 부족</span>");
		label.contents().first().addClass('label-alarm');
		flag = false; btnPress();
	} 

	if($('#telephone').val().length >= 10){
		label.contents().remove();
		label.append("<span>전화번호 사용가능</span>");
		label.contents().first().addClass('label-alarm blue');
		flag = true;
		btnPress(); 
	}else if($('#telephone').val().length < 10){
		flag = false;
	}
}

function btnPress(){
	if($('#id').val().length > 0 && $('#name').val().length > 0 && 
			$('#password').val().length > 0 && $('#email').val().length > 0 &&
			$('#telephone').val().length > 0 && $('#birthDate').val().length > 0){
		tot_flag = true;
	}else{
		tot_flag = false;
	}
    console.log(tot_flag, flag, pw_flag);
	if(flag == true && pw_flag == true && tot_flag == true){
		$('#loginBtnAdd').css('display','block');
		$('#loginCancel').css('display','none');
		popup();
		$('#loginBtnAdd').on('click', function(event){
			$.ajax(bit.contextRoot + '/members/insert.ajax', {
				type: 'POST',
				dataType: 'json', 
				data: { 
					id: $('#id').val(),
					name: $('#name').val(),
					password: $('#password').val(),
					email: $('#email').val(),
					telephone: $('#telephone').val(),
					birthDate: $('#birthDate').val(),
					status: status,
					level: membership
				},
				success: function(jsonObj){
					var result = jsonObj.ajaxResult;
					if (result.status == "ok") {
						location.href="../auth/login.html";
					} else {
						alert("입력 오류");
					}
				},
				error: function(xhr, ajaxOptions, thrownError){
					alert("통신 장애");
					console.log(xhr.status);
					console.log(thrownError);
				}
			});
		});
	}else{
		$('#loginBtnAdd').css('display','none');
		$('#loginCancel').css('display','block');
	}
}


/*팝업 클릭*/	
function popup() {
	// close button
	var closeBtn = $('<a href="#" data-rel="back" onclick=\'location.href="join.html"\' class="ui-btn-right ui-btn ui-btn-b ui-corner-all ui-btn-icon-notext ui-icon-delete ui-shadow">Close</a>');

	// text you get from Ajax
	var content = $('<h3>').text('회원 가입 약관').css('margin-top','35px')
	.css('margin-bottom','25px').addClass('center bold');
	
	// input String
	var contentStr = $('<textarea>').attr({"readonly":"readonly", "rows":"5", "cols":"20"})
						.css({"font-size":"14px", "resize":"none", "overflow-y":"scroll"})
							.html("<MissionImpossible>('migh.com'이하  'MissionImpossible GuestHouse')은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다. \n"
							+ "<MissionImpossible>('MissionImpossible GuestHouse')</em> 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.\n"
							+ "○ 본 방침은부터2014년7월10일부터 시행됩니다.\n"
							+ "1. 개인정보의 처리 목적 <MissionImpossible>('migh.com'이하  'MissionImpossible GuestHouse')은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다. \n"
							+ "가. 홈페이지 회원가입 및 관리회원 가입의사 확인, 서비스 부정이용 방지 등을 목적으로 개인정보를 처리합니다. \n"
							+ "나. 마케팅 및 광고에의 활용 \n"
							+ "이벤트 및 광고성 정보 제공 및 참여기회 제공 , 서비스의 유효성 확인 등을 목적으로 개인정보를 처리합니다. \n"
							+ "2. 개인정보 파일 현황 \n 1. 개인정보 파일명 : PersonalInfo \n - 개인정보 항목 : 비밀번호, 생년월일, 자택전화번호, 로그인ID, 휴대전화번호, 이름, 이메일, 쿠키 \n"
							+ "- 수집방법 : 홈페이지 \n- 보유근거 :  \n- 보유기간 : 탈퇴시 파기 \n- 관련법령 : 대금결제 및 재화 등의 공급에 관한 기록 : 5년\n"
							+ "3. 개인정보처리 위탁 \n"
							+ "①('MissionImpossible GuestHouse')은(는) 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다. \n"
							+ "②('migh.com'이하 'MissionImpossible GuestHouse')은(는) 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다. \n"
							+ "③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다. \n"
							+ "4. 정보주체의 권리,의무 및 그 행사방법 이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다. \n"
							+ "① 정보주체는 MissionImpossible(‘migh.com’이하 ‘MissionImpossible GuestHouse) 에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다. \n"
							+ "1. 개인정보 열람요구\n 2. 오류 등이 있을 경우 정정 요구\n 3. 삭제요구\n 4. 처리정지 요구\n"
							+ "5. 처리하는 개인정보의 항목 작성 \n"
							+ "<MissionImpossible>('migh.com'이하  'MissionImpossible GuestHouse')은(는) 다음의 개인정보 항목을 처리하고 있습니다. \n"
							+ "1<홈페이지 회원가입 및 관리> \n"
							+ "- 필수항목 : 비밀번호, 생년월일, 자택전화번호, 로그인ID, 휴대전화번호, 이름, 이메일, 쿠키\n - 선택항목 : ... \n"
							+ "6. 개인정보의 파기<MissionImpossible>('MissionImpossible GuestHouse')은(는) 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다. \n"
							+ "-파기절차\n 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.\n"
							+ "-파기기한\n 이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다. \n"
							+ "-파기방법\n DB에서 삭제하여 파기합니다. \n"
							+ "7. 개인정보의 안전성 확보 조치<MissionImpossible>('MissionImpossible GuestHouse')은(는) 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다. \n"
							+ "1. 내부관리계획의 수립 및 시행\n 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다. \n"
							+ "8. 개인정보 보호책임자 작성 \n"
							+ "①  MissionImpossible(‘migh.com’이하 ‘MissionImpossible GuestHouse) 은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다. \n 개인정보 보호책임자 \n 성명 :홍길동\n 직책 :홍길동\n 직급 :팀장\n"
							+ "연락처 :1111-1111, test@test.com, 02-1111-1111\n ※ 개인정보 보호 담당부서로 연결됩니다.\n ▶ 개인정보 보호 담당부서\n 부서명 : \n 담당자 : \n 연락처 :, , \n"
							+ "② 정보주체께서는 MissionImpossible(‘migh.com’이하 ‘MissionImpossible GuestHouse) 의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. MissionImpossible(‘migh.com’이하 ‘MissionImpossible GuestHouse) 은(는) 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다. \n"
							+ "9. 개인정보 처리방침 변경 \n"
							+ "①이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.");
	
	
	// check before confirm
	var checkBtn = $("<form>").append($("<label>").text("위 약관에 동의합니다.")
						.append($("<input>").attr("type","checkbox").attr("name","checkbox")
								.addClass("checkbox")/*.val("Y")*/));

	// make btn
	var btn = $('<div>').addClass("ui-grid-a")
				.append($('<div>').addClass('ui-block-a').append($('<a>')
						.attr({'href':'#', 'data-role':'button', 'role':'button','id':'confirm', 'data-rel':"back"})
						.addClass('confirm-btn').css("display","none").text('확인')))
				.append($('<div>').addClass('ui-block-b').append($('<a>')
						.attr({'href':'#', 'data-role':'button', 'role':'button','id':'cancel', 'data-rel':"back"}) 		  
						.addClass('cancel-btn').text('취소')));

	// Popup body - set width is optional - append button and Ajax msg
	var popup = $("<div/>", {
				"data-role": "popup",     	 
				}).css({
					width: $(window).width() / 1.2 + "px",
					padding: 10 + "px",
					height: $(window).height() / 1.2  + "px"
				}).append(closeBtn).append(content).append(contentStr).append(checkBtn).append(btn);
				
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
			/*체크 박스가 클릭 되었을 경우 값 확인*/
			$(".checkbox").on("click",function(){
				if($("input[name='checkbox']:checkbox:checked").val()==undefined){
					return $("#confirm").css("display","none");
				}else{
					return $("#confirm").css("display","block");
				}
			});
			
			/*체크 확인시*/ 
			$(document).on('click','a#confirm',function(){
				return $("<div>").addClass("label-alarm blue")
				.append("회원 가입 준비가 완료되었습니다.").appendTo("#joinForm");
			});
			
			/*삭제 확인시*/ 
			$(document).on('click','a#cancel',function(){
				alert("약관에 동의하지 않아 가입에 실패하였습니다.");
				return location.href="../members/join.html";
			});
		}
	}).popup("open");

	$("[data-role=popup]").trigger('create');
	
	
}

