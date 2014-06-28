package migh.controls.ajax;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import javax.management.RuntimeErrorException;

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
			@RequestParam(value="pageNo",defaultValue="1") int pageNo, 
			@RequestParam(value="pageSize",defaultValue="5") int pageSize) {
		
		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("count", reservationService.count());
    params.put("list",  reservationService.list(pageNo, pageSize));
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
 
  public static int getDiffDayCount(String fromDate, String toDate) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    try {
     return (int) ((sdf.parse(toDate).getTime() - sdf.parse(fromDate)
       .getTime()) / 1000 / 60 / 60 / 24); //millisec / sec / min / hour --> day
    } catch (Exception e) {
     return 0;
    } 
   }
  
  public static String[] getDiffDays(String fromDate, String toDate) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    SimpleDateFormat ndf = new SimpleDateFormat("MM-dd-yyyy");
    Calendar cal = Calendar.getInstance();
    try {
     cal.setTime(sdf.parse(fromDate));
    } catch (Exception e) {
    	e.getStackTrace();
    }
    int count = getDiffDayCount(fromDate, toDate);
    // 시작일부터
    cal.add(Calendar.DATE, -1);
    // 데이터 저장
    List<String> list = new ArrayList<String>();
    for (int i = 0; i <= count; i++) {
    	cal.add(Calendar.DATE, 1);
    	try{
    		String newDate = ndf.format(cal.getTime());
    		list.add(newDate);
    	}catch(RuntimeErrorException e){
    		e.printStackTrace();
    	}
    	//     list.add(sdf.format(cal.getTime()));
    }
    String[] result = new String[list.size()];
    list.toArray(result);
    System.out.println(list);
    return result;
  }
	
}
