package migh.vo;

import java.io.Serializable;

public class ReservationVo implements Serializable{
  private static final long serialVersionUID = 2002735441588660767L;
  
	private int no; //번호
  private int memberNo; //예약자
  private int roomNo; //방번호
  private int headcount; //투숙인원
  private String date; //예약일
  private String checkin; // 입실날짜
  private String checkout; //퇴실날짜
  private int basicPrice; //기본료
  private int deposit; //예약금
  private int discount; //할인액
  private char payStatus; //완납여부
  private char rsvStatus; //예약여부
  private char refund; //환불금  
  
	public int getNo() {
		return no;
	}
	public ReservationVo setNo(int no) {
		this.no = no;
		return this;
	}
	public int getMemberNo() {
		return memberNo;
	}
	public ReservationVo setMemberNo(int memberNo) {
		this.memberNo = memberNo;
		return this;
	}
	public int getRoomNo() {
		return roomNo;
	}
	public ReservationVo setRoomNo(int roomNo) {
		this.roomNo = roomNo;
		return this;
	}
	public int getHeadcount() {
		return headcount;
	}
	public ReservationVo setHeadcount(int headcount) {
		this.headcount = headcount;
		return this;
	}
	public String getDate() {
		return date;
	}
	public ReservationVo setDate(String date) {
		this.date = date;
		return this;
	}
	public String getCheckin() {
		return checkin;
	}
	public ReservationVo setCheckin(String checkin) {
		this.checkin = checkin;
		return this;
	}
	public String getCheckout() {
		return checkout;
	}
	public ReservationVo setCheckout(String checkout) {
		this.checkout = checkout;
		return this;
	}
	public int getBasicPrice() {
		return basicPrice;
	}
	public ReservationVo setBasicPrice(int basicPrice) {
		this.basicPrice = basicPrice;
		return this;
	}
	public int getDeposit() {
		return deposit;
	}
	public ReservationVo setDeposit(int deposit) {
		this.deposit = deposit;
		return this;
	}
	public int getDiscount() {
		return discount;
	}
	public ReservationVo setDiscount(int discount) {
		this.discount = discount;
		return this;
	}
	public char getPayStatus() {
		return payStatus;
	}
	public ReservationVo setPayStatus(char payStatus) {
		this.payStatus = payStatus;
		return this;
	}
	public char getRsvStatus() {
		return rsvStatus;
	}
	public ReservationVo setRsvStatus(char rsvStatus) {
		this.rsvStatus = rsvStatus;
		return this;
	}
	public char getRefund() {
		return refund;
	}
	public ReservationVo setRefund(char refund) {
		this.refund = refund;
		return this;
	}
}
