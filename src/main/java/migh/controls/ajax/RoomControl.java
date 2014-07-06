package migh.controls.ajax;

import java.util.HashMap;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import migh.services.RoomService;
import migh.vo.AjaxResult;
import migh.vo.RoomVo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

@Controller
@RequestMapping("/room")
public class RoomControl {
	static Logger log = Logger.getLogger(RoomControl.class);

	@Autowired
	RoomService roomService;
		
	public RoomControl() {
		log.debug("RoomControl 생성됨");
	}

	@RequestMapping("/list")
	public AjaxResult list() {
		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("photo", roomService.photoCount());
		params.put("count", roomService.count());
    params.put("list",  roomService.list());
    params.put("image", roomService.picList());
   
		return new AjaxResult()
			.setStatus("ok").setData(params);
	}
}
