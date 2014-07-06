package migh.vo;

import java.io.Serializable;

public class RoomVo implements Serializable {
  private static final long serialVersionUID = -978126313034446160L;
	private int no; //방 번호
  private String name; //객실이름
  private int number;  //객실번호
  private int size; //객실 사이즈
  private float square; // 평형
  private int accomodate; //수용인원
  private String detail; //상세내용 
  private int offWdPrice; //비수기 주중 가격
  private int offWePrice; //비수기 주말 가격
  private int peakWdPrice; //성수기 주중 가격
  private int peakWePrice; //성수기 주말 가격
  private String createDate; //작성일
//  private int picNo; //사진번호
//  private String picPath; //사진경로
  
	public int getNo() {
		return no;
	}
	public RoomVo setNo(int no) {
		this.no = no;
		return this;
	}
	public String getName() {
		return name;
	}
	public RoomVo setName(String name) {
		this.name = name;
		return this;
	}
	public int getNumber() {
		return number;
	}
	public RoomVo setNumber(int number) {
		this.number = number;
		return this;
	}
	public int getSize() {
		return size;
	}
	public RoomVo setSize(int size) {
		this.size = size;
		return this;
	}
	public float getSquare() {
		return square;
	}
	public RoomVo setSqaure(float square) {
		this.square = square;
		return this;
	}
	public int getAccomodate() {
		return accomodate;
	}
	public RoomVo setAccomodate(int accomodate) {
		this.accomodate = accomodate;
		return this;
	}
	public String getDetail() {
		return detail;
	}
	public RoomVo setDetail(String detail) {
		this.detail = detail;
		return this;
	}
	public int getOffWdPrice() {
		return offWdPrice;
	}
	public RoomVo setOffWdPrice(int offWdPrice) {
		this.offWdPrice = offWdPrice;
		return this;
	}
	public int getOffWePrice() {
		return offWePrice;
	}
	public RoomVo setOffWePrice(int offWePrice) {
		this.offWePrice = offWePrice;
		return this;
	}
	public int getPeakWdPrice() {
		return peakWdPrice;
	}
	public RoomVo setPeakWdPrice(int peakWdPrice) {
		this.peakWdPrice = peakWdPrice;
		return this;
	}
	public int getPeakWePrice() {
		return peakWePrice;
	}
	public RoomVo setPeakWePrice(int peakWePrice) {
		this.peakWePrice = peakWePrice;
		return this;
	}
	public String getCreateDate() {
		return createDate;
	}
	public RoomVo setCreateDate(String createDate) {
		this.createDate = createDate;
		return this;
	}
//	public int getPicNo() {
//		return picNo;
//	}
//	public RoomVo setPicNo(int picNo) {
//		this.picNo = picNo;
//		return this;
//	}
//	public String getPicPath() {
//		return picPath;
//	}
//	public RoomVo setPicPath(String picPath) {
//		this.picPath = picPath;
//		return this;
//	}
}
