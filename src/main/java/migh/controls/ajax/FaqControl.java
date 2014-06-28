package migh.controls.ajax;

import java.util.HashMap;

import migh.services.FaqService;
import migh.vo.AjaxResult;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/faq")
public class FaqControl {
	static Logger log = Logger.getLogger(FaqControl.class);

	@Autowired
	FaqService faqService;
		
	public FaqControl() {
		log.debug("FaqControl 생성됨");
	}

	@RequestMapping("/list")
	public AjaxResult list(
			@RequestParam(value="pageNo",defaultValue="1") int pageNo, 
			@RequestParam(value="pageSize",defaultValue="5") int pageSize) {
		
		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("count", faqService.count());
		params.put("list",  faqService.list(pageNo, pageSize));
		
		return new AjaxResult()
			.setStatus("ok")
			.setData(params);
	}
}
