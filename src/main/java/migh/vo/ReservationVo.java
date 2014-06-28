package migh.vo;

public class ReservationVo {
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
  private String id; //예약자 ID
  private String email; //예약자 이메일
  private String roomName; //객실명
  private int offWdPrice; //비수기 주중 가격
  private int offWePrice; //비수기 주말 가격
  private int peakWdPrice; //성수기 주중 가격
  private int peakWePrice; //성수기 주말 가격
  
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
	public String getId() {
		return id;
	}
	public ReservationVo setId(String id) {
		this.id = id;
		return this;
	}
	public String getEmail() {
		return email;
	}
	public ReservationVo setEmail(String email) {
		this.email = email;
		return this;
	}
	public String getRoomName() {
		return roomName;
	}
	public ReservationVo setRoomName(String roomName) {
		this.roomName = roomName;
		return this;
	}
	public int getOffWdPrice() {
		return offWdPrice;
	}
	public ReservationVo setOffWdPrice(int offWdPrice) {
		this.offWdPrice = offWdPrice;
		return this;
	}
	public int getOffWePrice() {
		return offWePrice;
	}
	public ReservationVo setOffWePrice(int offWePrice) {
		this.offWePrice = offWePrice;
		return this;
	}
	public int getPeakWdPrice() {
		return peakWdPrice;
	}
	public ReservationVo setPeakWdPrice(int peakWdPrice) {
		this.peakWdPrice = peakWdPrice;
		return this;
	}
	public int getPeakWePrice() {
		return peakWePrice;
	}
	public ReservationVo setPeakWePrice(int peakWePrice) {
		this.peakWePrice = peakWePrice;
		return this;
	}
}
