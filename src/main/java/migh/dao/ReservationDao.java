package migh.dao;

import java.util.List;
import java.util.Map;

import migh.vo.ReservationVo;

public interface ReservationDao {
	void insert(ReservationVo rsv) throws Throwable;
	void update(ReservationVo rsv) throws Throwable;
	void delete(ReservationVo rsv) throws Throwable;
	int count() throws Throwable;
	List<ReservationVo> list(Map<String,Integer> params) throws Throwable;
}
