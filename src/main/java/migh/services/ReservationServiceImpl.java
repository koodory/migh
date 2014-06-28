package migh.services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import migh.dao.MembersDao;
import migh.dao.ReservationDao;
import migh.dao.RoomDao;
import migh.vo.ReservationVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationServiceImpl implements ReservationService {
	
	@Autowired
	ReservationDao reservationDao;
	
	@Autowired
	MembersDao membersDao;
	
	@Autowired
	RoomDao roomDao;
	
	@Override
  public List<ReservationVo> list(int pageNo, int pageSize) {
		try {
			HashMap<String,Integer> params = new HashMap<String,Integer>();
			params.put("startIndex", (pageNo - 1) * pageSize);
			params.put("pageSize", pageSize);
			
			return reservationDao.list(params);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public int count() {
		try {
			return reservationDao.count();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public void add(ReservationVo rsv) {
		try {
			reservationDao.insert(rsv);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void change(ReservationVo rsv) {
		try {
			reservationDao.update(rsv);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void remove(ReservationVo rsv){
		try{
		reservationDao.delete(rsv);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
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
  
  @Override
  public String[] getDiffDays(String fromDate, String toDate) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
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
     list.add(sdf.format(cal.getTime()));
    }
    String[] result = new String[list.size()];
    list.toArray(result);
    return result;
  }
  	
}
