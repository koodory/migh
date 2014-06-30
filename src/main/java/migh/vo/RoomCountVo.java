package migh.vo;

import java.io.Serializable;

public class RoomCountVo implements Serializable {
  private static final long serialVersionUID = 6115445788667704853L;
	int no; //방번호
	int count; //갯수
	
	public int getNo() {
		return no;
	}
	public RoomCountVo setNo(int no) {
		this.no = no;
		return this;
	}
	public int getCount() {
		return count;
	}
	public RoomCountVo setCount(int count) {
		this.count = count;
		return this;
	}
}
