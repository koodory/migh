package migh.controls.ajax;

import migh.services.MembersService;
import migh.vo.AjaxResult;
import migh.vo.MembersVo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/members")
public class MembersControl {
	static Logger log = Logger.getLogger(MembersControl.class);

	@Autowired
	MembersService membersService;
		
	public MembersControl() {
		log.debug("MembersControl 생성됨");
	}

	@RequestMapping("/detail")
	public AjaxResult detail(int no, Model model) {
		MembersVo s = membersService.detail(no);
		if (s != null) {
			return new AjaxResult()
				.setStatus("ok")
				.setData(s);
		} else {
			return new AjaxResult().setStatus("failure");
		}
	}

	@RequestMapping(value="/insert", method=RequestMethod.POST)
	public AjaxResult insert(MembersVo vo) {		
		membersService.add(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/update", method=RequestMethod.POST)
	public AjaxResult update(MembersVo vo, Model model) {
		membersService.change(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/delete", method=RequestMethod.GET)
	public AjaxResult delete(int no) {
		membersService.remove(no);
		return new AjaxResult().setStatus("ok");
	}

}
