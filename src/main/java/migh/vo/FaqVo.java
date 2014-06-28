package migh.vo;

import java.io.Serializable;

@SuppressWarnings("serial")
public class FaqVo implements Serializable{
//	private static final long serialVersionUID = 1L;

	private int 	  no; // FAQ 번호(자동생성)
	private String	question; // FAQ 제목
	private String	answer; //FAQ 대답내용
	private int	order; // FAQ 순서
	
	public int getNo() {
		return no;
	}
	public FaqVo setNo(int no) {
		this.no = no;
		return this;
	}
	public String getQuestion() {
		return question;
	}
	public FaqVo setQuestion(String question) {
		this.question = question;
		return this;
	}
	public String getAnswer() {
		return answer;
	}
	public FaqVo setAnswer(String answer) {
		this.answer = answer;
		return this;
	}
	public int getOrder() {
		return order;
	}
	public FaqVo setOrder(int order) {
		this.order = order;
		return this;
	}
	
}
