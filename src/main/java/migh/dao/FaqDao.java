package migh.dao;

import java.util.List;
import java.util.Map;
import migh.vo.FaqVo;

public interface FaqDao {
	int count() throws Throwable;
	List<FaqVo> list(Map<String,Integer> params) throws Throwable;
}
