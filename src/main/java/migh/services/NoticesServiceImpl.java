package migh.services;

import java.util.HashMap;
import java.util.List;

import migh.dao.NoticesDao;
import migh.vo.NoticesVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoticesServiceImpl implements NoticesService {
	
	@Autowired
	NoticesDao noticesDao;
		
	@Override
  public List<NoticesVo> list(int pageNo, int pageSize) {
		try {
			HashMap<String,Integer> params = new HashMap<String,Integer>();
			params.put("startIndex", (pageNo - 1) * pageSize);
			params.put("pageSize", pageSize);
			
			return noticesDao.list(params);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public int count() {
		try {
			return noticesDao.count();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
}
