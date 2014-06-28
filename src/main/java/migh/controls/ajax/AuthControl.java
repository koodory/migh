package migh.controls.ajax;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import migh.services.AuthService;
import migh.services.MembersGroup;
import migh.vo.AjaxResult;
import migh.vo.MembersVo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@RequestMapping("/auth")
@SessionAttributes("loginUser")
public class AuthControl {
	static Logger log = Logger.getLogger(AuthControl.class);
	
	@Autowired
	AuthService authService;
	
	/* 리턴 타입은 JSON으로 출력할 객체이다.
	 * - 자동으로 JSON 문자열로 변환하려면, 빈 설정파일에
	 *   JSON 변환 해결사를 등록해야 한다.
	 */
  @RequestMapping("/login")
	public AjaxResult login(
			String id, 
			String password, 
			HttpServletResponse response,
			Model model) {
		try {
			 MembersVo membersVo = null;
				  membersVo = authService.getLoginUser(id, password, MembersGroup.NORMAL);
				
				AjaxResult result = null;
				if (membersVo == null) {
					result =  new AjaxResult().setStatus("ok").setData("failure");
							
				} else {
					result = new AjaxResult().setStatus("ok")	.setData("success");
					model.addAttribute("loginUser", membersVo);
					
				}
				response.setContentType("text/html;charset=UTF-8");
				return result;
				
		} catch (Throwable ex) {
			return new AjaxResult()
					.setStatus("error")
					.setData(ex.getMessage());
		}
	}
		
	@RequestMapping("/logout")
  public AjaxResult logout(HttpSession session) {
		session.removeAttribute("loginUser");
		if (session != null) { session.invalidate();}
		return new AjaxResult().setStatus("failure").setData("로그인하지 않았습니다.");
  }
		
	@RequestMapping("/getLoginUser")
	public AjaxResult getLoginUser(HttpSession session){
		MembersVo loginUser = (MembersVo)session.getAttribute("loginUser");
		if(loginUser == null){
			return new AjaxResult().setStatus("failure").setData("로그인하지 않았습니다.");
		}
		return new AjaxResult().setStatus("ok").setData(loginUser);
	}
	
	@RequestMapping(value="/getLoginId")
	public AjaxResult getLoginId(String id){
		try {
			MembersVo membersVo = authService.getLoginId(id);

			AjaxResult result = null;
			if (membersVo == null) {
				result = new AjaxResult().setStatus("ok").setData("success");	
			} else {
				result = new AjaxResult().setStatus("ok")	.setData("failure");
			}
			return result;
			
	} catch (Throwable ex) {
		return new AjaxResult()
				.setStatus("error")
				.setData(ex.getMessage());
	}
	}
	
	@RequestMapping(value="/getLoginEmail")
	public AjaxResult getLoginEmail(String email){
		try {
			MembersVo membersVo = authService.getLoginEmail(email);

			AjaxResult result = null;
			if (membersVo == null) {
				result = new AjaxResult().setStatus("ok").setData("success");	
			} else {
				result = new AjaxResult().setStatus("ok").setData("failure");
			}
			return result;
			
	} catch (Throwable ex) {
		return new AjaxResult()
				.setStatus("error")
				.setData(ex.getMessage());
	}
	}
}
