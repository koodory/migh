package migh.dao;

import java.util.List;
import java.util.Map;

import migh.vo.PhotosVo;

public interface PhotosDao {
//	void upload(PhotosVo photos) throws Throwable;
	void insert(PhotosVo photosVo) throws Throwable;
	void update(PhotosVo photosvo) throws Throwable;
	void delete(PhotosVo photosVo) throws Throwable;
	int count() throws Throwable;
	List<PhotosVo> list(Map<String,Integer> params) throws Throwable;
}
