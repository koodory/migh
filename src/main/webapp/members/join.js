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
