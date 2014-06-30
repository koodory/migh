package migh.vo;

import java.io.Serializable;

public class MembersVo implements Serializable{
  private static final long serialVersionUID = 1651702783499069254L;
	int 	  no; // 회원 번호(자동생성)
  String 	id; // 회원 아이디(20)
  String  name; //회원 이름
  String 	password; // 회원 비밀번호(20)
  String 	email; // 회원 이메일(200)
  String 	telephone; // 회원 전화번호(13)
  String 	birthDate; // 회원 생일
  String 	status; //회원 여부(Y/N)
  String 	registDate; //회원 가입일
  String  level; // 회원 등급(20)
	public int getNo() {
		return no;
	}
	public MembersVo setNo(int no) {
		this.no = no;
		return this;
	}
	public String getId() {
		return id;
	}
	public MembersVo setId(String id) {
		this.id = id;
		return this;
	}
	public String getName() {
		return name;
	}
	public MembersVo setName(String name) {
		this.name = name;
		return this;
	}
	public String getPassword() {
		return password;
	}
	public MembersVo setPassword(String password) {
		this.password = password;
		return this;
	}
	public String getEmail() {
		return email;
	}
	public MembersVo setEmail(String email) {
		this.email = email;
		return this;
	}
	public String getTelephone() {
		return telephone;
	}
	public MembersVo setTelephone(String telephone) {
		this.telephone = telephone;
		return this;
	}
	public String getBirthDate() {
		return birthDate;
	}
	public MembersVo setBirthDate(String birthDate) {
		this.birthDate = birthDate;
		return this;
	}
	public String getStatus() {
		return status;
	}
	public MembersVo setStatus(String status) {
		this.status = status;
		return this;
	}
	public String getRegistDate() {
		return registDate;
	}
	public MembersVo setRegistDate(String registDate) {
		this.registDate = registDate;
		return this;
	}
	public String getLevel() {
		return level;
	}
	public MembersVo setLevel(String level) {
		this.level = level;
		return this;
	}
}
