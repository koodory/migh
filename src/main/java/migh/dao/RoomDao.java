package migh.dao;

import java.util.HashMap;
import java.util.List;

import migh.vo.RoomCountVo;
import migh.vo.RoomVo;

public interface RoomDao {
	int count() throws Throwable;
	List<RoomVo> list() throws Throwable;
	void upload(HashMap<String, String> param) throws Throwable;
	List<RoomCountVo> photoCount() throws Throwable;
}
