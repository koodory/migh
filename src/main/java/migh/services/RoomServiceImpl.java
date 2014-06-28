package migh.services;

import java.util.HashMap;
import java.util.List;

import migh.dao.RoomDao;
import migh.vo.RoomCountVo;
import migh.vo.RoomVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceImpl implements RoomService {

	@Autowired
	RoomDao roomDao;

	@Override
	public List<RoomVo> list() {
		try {			
			return roomDao.list();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}

	@Override
	public int count() {
		try {
			return roomDao.count();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}

	@Override
	public void upload(int index, String filename){
		try {
			HashMap<String, String> params = new HashMap<String, String>();
			params.put("roomNo", index + "");
			params.put("picPath", filename); 

			roomDao.upload(params);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}

	@Override
	public List<RoomCountVo> photoCount(){
		try {
			return roomDao.photoCount();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}
}
