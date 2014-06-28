package migh.dao;

import java.util.List;
import java.util.Map;

import migh.vo.QnaVo;

public interface QnaDao {
	void insert(QnaVo qna) throws Throwable;
	void update(QnaVo qna) throws Throwable;
	void delete(QnaVo qna) throws Throwable;
	int count() throws Throwable;
	List<QnaVo> list(Map<String,Integer> params) throws Throwable;
}
