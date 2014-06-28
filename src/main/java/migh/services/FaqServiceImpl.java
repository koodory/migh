package migh.services;

import java.util.HashMap;
import java.util.List;

import migh.dao.FaqDao;
import migh.vo.FaqVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FaqServiceImpl implements FaqService {
	
	@Autowired
	FaqDao faqDao;
	
	@Override
  public List<FaqVo> list(int pageNo, int pageSize) {
		try {
			HashMap<String,Integer> params = new HashMap<String,Integer>();
			params.put("startIndex", (pageNo - 1) * pageSize);
			params.put("pageSize", pageSize);
			
			return faqDao.list(params);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public int count() {
		try {
			return faqDao.count();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
}
