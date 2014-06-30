package migh.services;

import java.util.HashMap;
import java.util.List;

import migh.dao.MembersDao;
import migh.dao.PhotosDao;
import migh.vo.PhotosVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PhotosServiceImpl implements PhotosService {
	
	@Autowired
	PhotosDao photosDao;
	
	@Autowired
	MembersDao membersDao;
		
	@Override
  public List<PhotosVo> list(int pageNo, int pageSize) {
		try {
			HashMap<String,Integer> params = new HashMap<String,Integer>();
			params.put("startIndex", (pageNo - 1) * pageSize);
			params.put("pageSize", pageSize);
			
			return photosDao.list(params);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public int count() {
		try {
			return photosDao.count();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
//	@Override
//	public void upload(PhotosVo photos, String filename) {
//		try {
//			HashMap<String, String> params = new HashMap<String, String>();
//			params.put("photosNo", index + "");
//			params.put("PhotosVo", photos);
//			params.put("photosImg", filename); 
//			photos.setPhotosImg(filename);
//			photosDao.upload(photos);
//		} catch (Throwable ex) {
//			throw new RuntimeException(ex);
//		}
//	}
	
	@Override
	  public void add(PhotosVo photos) {
			try {
				photosDao.insert(photos);
			} catch (Throwable ex) {
				throw new RuntimeException(ex);
			}
	  }

	@Override
  public void change(PhotosVo photos) {
		try {
			photosDao.update(photos);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void remove(PhotosVo photos){
		try{
		photosDao.delete(photos);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
}
