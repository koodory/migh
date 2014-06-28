$(document).ready(function(){

	$('#btnRegister').on('click', function(event){
		event.preventDefault();
		location.href="../members/join.html";
	});

	$('#btnByPass').click(function(){
		event.preventDefault();
		$.ajax(bit.contextRoot + '/auth/login.ajax', {
			type: 'POST',
			dataType: 'json', /*서버에서 보내는 데이터의 형식 지정 */
			data: {
				id: "GUEST",
				password: "@guest"
			},
			success: function(jsonObj){
				console.log(jsonObj);
				var result = jsonObj.ajaxResult;
				location.href="../index.html";
				if (result.status == "ok" && result.data == "GUEST") {
					consoel.log(result);
					location.href="../index.html";
				}
			},
			error: function(xhr, status, errorThrown){
				$('#login-text').contents().remove();
				$('#login-text').addClass("label-alarm red")
				.append("통신오류");
				console.log(status);
				console.log(errorThrown);
			}
		});

	});

	$('#btnLogin').on('click', function(event){
		event.preventDefault();
		if ($('#id').val().length == 0 ||
				$('#password').val().length == 0) {
			$('#login-text').contents().remove();
			$('#login-text').addClass("label-alarm red remove-shadow")
			.append("이메일과 암호는 필수 입력입니다.");
			return;
		}

		$.ajax(bit.contextRoot + '/auth/login.ajax', {
			type: 'POST',
			dataType: 'json', /*서버에서 보내는 데이터의 형식 지정 */
			data: { /* 서버쪽으로 보내는 데이터 */
				id: $('#id').val(),
				password: $('#password').val(),
				saveId: ($('#saveId:checked').length > 0) ? 
						'true':'false'
			},
			success: function(jsonObj){
				console.log(jsonObj);
				var result = jsonObj.ajaxResult;
				if (result.status == "ok" && result.data == "success") {
					location.href="../index.html";
				} else {
					$('#login-text').contents().remove();
					$('#login-text').addClass('label-alarm')
					.append("<span>이메일 또는 암호가 틀림!</span>")
					.append("<br><br><span>회원이 아니신 경우 </span><br>" +
					" <span>회원가입 버튼을 눌러주십시오.</span>");
					$('#login-text').contents().first().addClass('red remove-shadow');
					$('#id').val(""); $('#password').val("");
				}
			},
			error: function(xhr, status, errorThrown){
				$('#login-text').contents().remove();
				$('#login-text').addClass("label-alarm red")
				.append("통신오류");
				console.log(status);
				console.log(errorThrown);
			}
		});

		// 로그인 성공 후에 해야할 작업을 여기에 기술한다면,당신은 바보!
		//location.href="../subject/list.bit";
	});
});
