package migh.services;

import java.util.HashMap;

import migh.dao.MembersDao;
import migh.vo.MembersVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
	@Autowired
	MembersDao membersDao;

	@Override
	public MembersVo getLoginUser
	(String id, String password, MembersGroup group) {
		try {
			if (group == MembersGroup.NORMAL || group == MembersGroup.ADMIN) {
				HashMap<String,String> params = new HashMap<String,String>();
				params.put("id", id);
				params.put("password", password);
				return membersDao.getLoginUser(params);
			}
			return null;
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}
		
	@Override
	public MembersVo getLoginId(String id) {
		try {
			HashMap<String,String> param = new HashMap<String,String>();
			param.put("id",id);
			
			return membersDao.getLoginId(param);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}
	
	@Override
	public MembersVo getLoginEmail(String email) {
		try {
			HashMap<String,String> param = new HashMap<String,String>();
			param.put("email",email);
			
			return membersDao.getLoginEmail(param);
		} catch (Throwable ex) {
			throw new RuntimeException(ex);
		}
	}
}
