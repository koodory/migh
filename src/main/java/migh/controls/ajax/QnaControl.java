package migh.controls.ajax;

import java.util.HashMap;

import migh.services.QnaService;
import migh.vo.AjaxResult;
import migh.vo.QnaVo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/qna")
public class QnaControl {
	static Logger log = Logger.getLogger(QnaControl.class);

	@Autowired
	QnaService qnaService;
		
	public QnaControl() {
		log.debug("QnaControl 생성됨");
	}

	@RequestMapping("/list")
	public AjaxResult list(
			@RequestParam(value="pageNo",defaultValue="1") int pageNo, 
			@RequestParam(value="pageSize",defaultValue="5") int pageSize) {
		
		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("count", qnaService.count());
    params.put("list",  qnaService.list(pageNo, pageSize));

		return new AjaxResult()
			.setStatus("ok")
			.setData(params);
	}
	
	@RequestMapping(value="/insert", method=RequestMethod.POST)
	public AjaxResult insert(QnaVo vo) {		
		qnaService.add(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/update", method=RequestMethod.POST)
	public AjaxResult update(QnaVo vo) {
		qnaService.change(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/delete", method=RequestMethod.POST)
	public AjaxResult delete(QnaVo vo) {
		qnaService.remove(vo);
		return new AjaxResult().setStatus("ok");
	}
}
