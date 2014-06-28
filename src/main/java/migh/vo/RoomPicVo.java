package migh.vo;

public class RoomPicVo {
  private int no; //사진번호
  String picPath; //사진경로
  int roomNo; //방 번호
  
	public int getNo() {
		return no;
	}
	public RoomPicVo setNo(int no) {
		this.no = no;
		return this;
	}
	public String getPicPath() {
		return picPath;
	}
	public RoomPicVo setPicPath(String picPath) {
		this.picPath = picPath;
		return this;
	}
	public int getRoomNo() {
		return roomNo;
	}
	public RoomPicVo setRoomNo(int roomNo) {
		this.roomNo = roomNo;
		return this;
	}
}
