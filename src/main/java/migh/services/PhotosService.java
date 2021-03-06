package migh.services;

import java.util.List;

import migh.vo.PhotosVo;

/* Service 객체의 호출 규칙 정의 = protocol = interface
 * - 서비스 객체는 업무 절차를 정의하고 있다.
 * - 트랜잭션을 정의한다.
 * - 메서드의 이름은 업무에서 사용하는 용어를 쓴다. 
 */
public interface PhotosService {
	int count();
	List<PhotosVo> list(int pageNo, int pageSize);
//	void upload(PhotosVo photos, String filename);
	void add(PhotosVo photos);
	void change(PhotosVo photos);
	void remove(PhotosVo photos);
}
