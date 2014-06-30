package migh.vo;

import java.io.Serializable;

public class PhotosVo implements Serializable{
	private static final long serialVersionUID = 1L;

	int 	photosNo; // Photos 번호(자동생성)
	int 	memberNo; // Mem 번호
	String	photosTitle; // Photos 제목
	String	photosContent; // Photos 내용
	String 	photosImg;// Photos 이미지
	int		photosHit; // Photos 히트수
	String	photosCrDate; // Photos 게시판 작성일
	String 	memberId; // Member ID;
	
	public int getPhotosNo() {
		return photosNo;
	}
	public PhotosVo setPhotosNo(int photosNo) {
		this.photosNo = photosNo;
		return this;
	}
	public int getMemberNo() {
		return memberNo;
	}
	public PhotosVo setMemberNo(int memberNo) {
		this.memberNo = memberNo;
		return this;
	}
	public String getPhotosTitle() {
		return photosTitle;
	}
	public PhotosVo setPhotosTitle(String photosTitle) {
		this.photosTitle = photosTitle;
		return this;
	}
	public String getPhotosContent() {
		return photosContent;
	}
	public PhotosVo setPhotosContent(String photosContent) {
		this.photosContent = photosContent;
		return this;
	}
	public String getPhotosImg() {
		return photosImg;
	}
	public PhotosVo setPhotosImg(String photosImg) {
		this.photosImg = photosImg;
		return this;
	}
	public int getPhotosHit() {
		return photosHit;
	}
	public PhotosVo setPhotosHit(int photosHit) {
		this.photosHit = photosHit;
		return this;
	}
	public String getPhotosCrDate() {
		return photosCrDate;
	}
	public PhotosVo setPhotosCrDate(String photosCrDate) {
		this.photosCrDate = photosCrDate;
		return this;
	}
	public String getMemberId() {
		return memberId;
	}
	public PhotosVo setMemberId(String memberId) {
		this.memberId = memberId;
		return this;
	}
	
}
