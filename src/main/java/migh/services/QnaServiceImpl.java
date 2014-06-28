package migh.services;

import java.util.HashMap;
import java.util.List;

import migh.dao.MembersDao;
import migh.dao.QnaDao;
import migh.vo.QnaVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QnaServiceImpl implements QnaService {
	
	@Autowired
	QnaDao qnaDao;
	
	@Autowired
	MembersDao membersDao;
		
	@Override
  public List<QnaVo> list(int pageNo, int pageSize) {
		try {
			HashMap<String,Integer> params = new HashMap<String,Integer>();
			params.put("startIndex", (pageNo - 1) * pageSize);
			params.put("pageSize", pageSize);
			
			return qnaDao.list(params);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public int count() {
		try {
			return qnaDao.count();
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
	
	@Override
  public void add(QnaVo qna) {
		try {
			qnaDao.insert(qna);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void change(QnaVo qna) {
		try {
			qnaDao.update(qna);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void remove(QnaVo qna){
		try{
		qnaDao.delete(qna);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
}
