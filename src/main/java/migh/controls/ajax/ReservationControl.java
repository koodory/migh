package migh.controls.ajax;

import java.util.HashMap;

import migh.services.ReservationService;
import migh.vo.AjaxResult;
import migh.vo.ReservationVo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/reservation")
public class ReservationControl {
	static Logger log = Logger.getLogger(ReservationControl.class);

	@Autowired
	ReservationService reservationService;
			
	public ReservationControl() {
		log.debug("reservation 생성됨");
	}

	@RequestMapping("/list")
	public AjaxResult list(
			@RequestParam(value="memberNo") int memberNo,
			@RequestParam(value="roomNo") int roomNo) {

		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("count", reservationService.count());
		params.put("days", reservationService.getDays(roomNo));
		params.put("rsvDays", reservationService.rsvDays());
    
    if(reservationService.list(memberNo) != null){
      params.put("list",  reservationService.list(memberNo));
    }
    
   return new AjaxResult()
			.setStatus("ok")
			.setData(params);
	}
	
		
	@RequestMapping(value="/insert", method=RequestMethod.POST)
	public AjaxResult insert(ReservationVo vo) {		
		reservationService.add(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/update", method=RequestMethod.POST)
	public AjaxResult update(ReservationVo vo, Model model) {
		reservationService.change(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/delete", method=RequestMethod.POST)
	public AjaxResult delete(ReservationVo vo) {
		reservationService.remove(vo);
		return new AjaxResult().setStatus("ok");
	}
	
}
