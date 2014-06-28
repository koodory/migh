package migh.controls.ajax;

import java.util.HashMap;

import migh.services.NoticesService;
import migh.vo.AjaxResult;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/notice")
public class NoticesControl {
	static Logger log = Logger.getLogger(NoticesControl.class);

	@Autowired
	NoticesService noticesService;
		
	public NoticesControl() {
		log.debug("NoticesControl 생성됨");
	}

	@RequestMapping("/list")
	public AjaxResult list(
			@RequestParam(value="pageNo",defaultValue="1") int pageNo, 
			@RequestParam(value="pageSize",defaultValue="10") int pageSize) {
		
		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("count", noticesService.count());
		params.put("list",  noticesService.list(pageNo, pageSize));
		
		return new AjaxResult()
			.setStatus("ok")
			.setData(params);
	}
}
