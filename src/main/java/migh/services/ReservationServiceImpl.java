package migh.services;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.RuntimeErrorException;

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
  public List<ReservationVo> list(int memberNo) {
		try {			
			return reservationDao.list(memberNo);
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
  
  public static List<String> getDiffDays(String fromDate, String toDate) {
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
    for (int i = 0; i <= count - 1; i++) {
    	cal.add(Calendar.DATE, 1);
    	try{
    		String newDate = sdf.format(cal.getTime());
    		list.add(newDate);
    	}catch(RuntimeErrorException e){
    		e.printStackTrace();
    	}
    	//     list.add(sdf.format(cal.getTime()));
    }
    String[] result = new String[list.size()];
    list.toArray(result);
    return list;
  }
  	
  @Override
	public ArrayList<String> getDays(int roomNo){
		try {
		   List<HashMap<String, String>> dates =  reservationDao.getDays(roomNo); 
		   ArrayList<String> days = new ArrayList<String>();
		   DateFormat df = new SimpleDateFormat("yyyy-MM-dd");  
		   String checkin, checkout;
		    		   
		    for(int i=0; i < dates.size(); i++){
					 HashMap<String, String> getMap = dates.get(i); 
					 checkin = (String)df.format(getMap.get("date(Rsv_InDate)")); 
					 checkout = (String)df.format(getMap.get("date(Rsv_OutDate)"));

		       List<String> temp = getDiffDays(checkin, checkout);
		       days.addAll(temp); 

		   }
			return days;
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}
  
  @Override
	public HashMap<Integer, ArrayList<String>> rsvDays(){
		try {
		   List<HashMap<String, String>> dates =  reservationDao.rsvDays();
		   HashMap<Integer, ArrayList<String>> dayArray = new HashMap<Integer, ArrayList<String>>(); 
		   ArrayList<String> days = new ArrayList<String>();
		   ArrayList<Integer> no = new ArrayList<Integer>();
		   DateFormat df = new SimpleDateFormat("yyyy-MM-dd");  
		   String checkin, checkout, count;
		   int index, revIdx = 0;
		    		   
		    for(int i=0; i < dates.size(); i++){
					 HashMap<String, String> getMap = dates.get(i); 
					 checkin = (String)df.format(getMap.get("date(Rsv_InDate)")); 
					 checkout = (String)df.format(getMap.get("date(Rsv_OutDate)"));
					 Object obj = getMap.get("Rom_Idx");
		       if(i==0){
		      	 revIdx = (int)obj;
		       }
					 index = ((int)obj+1) - revIdx; // 인덱스가 1부터 시작하도록 보정
					 no.add(index);
		       List<String> temp = getDiffDays(checkin, checkout);
		       if(i == 0 || index == no.get(i-1)){  // 전데이터와 현데이터의 방이 같을때
		         days.addAll(temp);
		         if(index == dates.size()-1){ // 마지막 데이터 일때
		        	 dayArray.put(no.get(i), days);
		         }
		       }else{ //방이 바뀔때
		      	 dayArray.put(no.get(i-1), days); //이전방 번호 부여
		      	 days = new ArrayList<String>(); //새 방 배열 생성
		      	 days.addAll(temp); // 자료 입력
		      	 dayArray.put(no.get(i), days);
		       }
		   }
			return dayArray;
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}
}
