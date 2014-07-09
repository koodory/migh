package migh.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import migh.vo.QnaVo;
import migh.vo.ReservationVo;

public interface ReservationDao {
	void insert(ReservationVo rsv) throws Throwable;
	void allUpdate(ReservationVo rsv) throws Throwable;
	void update(ReservationVo rsv) throws Throwable;
	void delete(ReservationVo rsv) throws Throwable;
	int count() throws Throwable;
	List<ReservationVo> allList(Map<String,Integer> params) throws Throwable;
	List<ReservationVo> list(int memberNo) throws Throwable;
	List<HashMap<String,String>> getDays(int roomNo) throws Throwable;
	List<HashMap<String,String>> rsvDays() throws Throwable;
}
