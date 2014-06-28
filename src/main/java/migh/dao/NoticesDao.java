package migh.dao;

import java.util.List;
import java.util.Map;
import migh.vo.NoticesVo;

public interface NoticesDao {
	int count() throws Throwable;
	List<NoticesVo> list(Map<String,Integer> params) throws Throwable;
}
