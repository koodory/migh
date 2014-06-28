package migh.vo;

import java.io.Serializable;

public class QnaVo implements Serializable{
	private static final long serialVersionUID = 1L;

	int 	qnaNo; // Qna 번호(자동생성)
	int 	memberNo; // Mem 번호
	String	title; //Qna 제목
	String	question; // Qna 질문내용
	String	qDatetime; // Qna 질문 작성일
	int 	hit;// Qna 조회수
	String	answer; // Qna 답변내용
	String	aDatetime; // Qna 답변 작성일
	String memberId; //Member ID;
	
	public String getMemberId() {
		return memberId;
	}
	public QnaVo setMemberId(String memberId) {
		this.memberId = memberId;
		return this;
	}
	public int getMemberNo() {
		return memberNo;
	}
	public QnaVo setMemberNo(int memberNo) {
		this.memberNo = memberNo;
		return this;
	}
	
	public int getQna_No() {
		return qnaNo;
	}
	public QnaVo setQna_No(int qnaNo) {
		this.qnaNo = qnaNo;
		return this;
	}

	public String getTitle() {
		return title;
	}
	public QnaVo setTitle(String title) {
		this.title = title;
		return this;
	}
	public String getQuestion() {
		return question;
	}
	public QnaVo setQuestion(String question) {
		this.question = question;
		return this;
	}
	public String getQDatetime() {
		return qDatetime;
	}
	public QnaVo setQDatetime(String qDatetime) {
		this.qDatetime = qDatetime;
		return this;
	}
	public int getHit() {
		return hit;
	}
	public QnaVo setHit(int hit) {
		this.hit = hit;
		return this;
	}
	public String getAnswer() {
		return answer;
	}
	public QnaVo setAnswer(String answer) {
		this.answer = answer;
		return this;
	}
	public String getADatetime() {
		return aDatetime;
	}
	public QnaVo setADatetime(String aDatetime) {
		this.aDatetime = aDatetime;
		return this;
	}
}
