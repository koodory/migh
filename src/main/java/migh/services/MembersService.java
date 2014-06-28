package migh.services;

import migh.vo.MembersVo;

/* Service 객체의 호출 규칙 정의 = protocol = interface
 * - 서비스 객체는 업무 절차를 정의하고 있다.
 * - 트랜잭션을 정의한다.
 * - 메서드의 이름은 업무에서 사용하는 용어를 쓴다. 
 */
public interface MembersService {
	void add(MembersVo members);
	MembersVo detail(int no);
	void change(MembersVo members);
	void remove(int no);
}
