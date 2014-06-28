package migh.services;

import migh.vo.MembersVo;

public interface AuthService {
	MembersVo getLoginUser(String id, String password, MembersGroup group);
  MembersVo getLoginId(String id);
  MembersVo getLoginEmail(String email); 
}
