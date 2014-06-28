package migh.services;

import migh.dao.MembersDao;
import migh.vo.MembersVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MembersServiceImpl implements MembersService {
	
	@Autowired
	MembersDao membersDao;
	
	@Override
  public void add(MembersVo members) {
		try {
			membersDao.insert(members);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public MembersVo detail(int no) {
		try {
			return membersDao.detail(no);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void change(MembersVo members) {
		try {
			membersDao.update(members);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }

	@Override
  public void remove(int no) {
		try {
			membersDao.delete(no);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
  }
}
