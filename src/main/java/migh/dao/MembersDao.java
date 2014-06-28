package migh.dao;

import java.util.HashMap;

import migh.vo.MembersVo;

public interface MembersDao {
	void insert(MembersVo members) throws Throwable;
	MembersVo detail(int no) throws Throwable;
	void update(MembersVo members) throws Throwable;
	void delete(int no) throws Throwable;
	MembersVo getLoginUser(HashMap<String, String> params) throws Throwable;
	MembersVo getLoginId(HashMap<String, String> param) throws Throwable;
	MembersVo getLoginEmail(HashMap<String, String> param) throws Throwable;
}
