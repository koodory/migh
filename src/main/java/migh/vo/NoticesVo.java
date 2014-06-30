package migh.vo;

import java.io.Serializable;

public class NoticesVo implements Serializable{
  private static final long serialVersionUID = -2927988633901365278L;
	
  int 	  no; // 공지사항 번호(자동생성)
	String	title; // 공지사항 제목
	String	content; //공지사항 내용
	int	hit; // 공지사항 히트 수
	String	datetime; // 공지사항 작성일
	public int getNo() {
		return no;
	}
	public NoticesVo setNo(int no) {
		this.no = no;
		return this;
	}
	public String getTitle() {
		return title;
	}
	public NoticesVo setTitle(String title) {
		this.title = title;
		return this;
	}
	public String getContent() {
		return content;
	}
	public NoticesVo setContent(String content) {
		this.content = content;
		return this;
	}
	public int getHit() {
		return hit;
	}
	public NoticesVo setHit(int hit) {
		this.hit = hit;
		return this;
	}
	public String getDatetime() {
		return datetime;
	}
	public NoticesVo setDatetime(String datetime) {
		this.datetime = datetime;
		return this;
	}
}
