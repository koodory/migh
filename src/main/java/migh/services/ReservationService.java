package migh.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import migh.vo.ReservationVo;

/* Service 객체의 호출 규칙 정의 = protocol = interface
 * - 서비스 객체는 업무 절차를 정의하고 있다.
 * - 트랜잭션을 정의한다.
 * - 메서드의 이름은 업무에서 사용하는 용어를 쓴다. 
 */
public interface ReservationService {
	int count();
	List<ReservationVo> list(int memberNo);
	void add(ReservationVo rsv);
	void change(ReservationVo rsv);
	void remove(ReservationVo rsv);
	ArrayList<String> getDays(int roomNo);
}
