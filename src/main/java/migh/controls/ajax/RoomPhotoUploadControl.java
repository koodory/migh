package migh.controls.ajax;

import java.io.File;

import javax.servlet.ServletContext;

import migh.services.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/room/upload")
public class RoomPhotoUploadControl {
	static long fileCount;
	
	@Autowired
	ServletContext servletContext;
	
	@Autowired
	RoomService roomService;

  @RequestMapping
	public String execute(int index,
			@RequestParam("file1") MultipartFile file1,
			Model model) {
		try {
			String fullPath = servletContext.getRealPath("/upload");
			if (!file1.isEmpty()) {
				String filename = 
						System.currentTimeMillis() + "_" + ++fileCount;
				File savedFile = new File(fullPath + "/" + filename);
				file1.transferTo(savedFile); 			
				model.addAttribute("index", index);
				model.addAttribute("file1name", filename);
			  						
        roomService.upload(index, filename);
			}
			return "file/uploadResult";
		
		} catch (Throwable ex) {
			throw new Error(ex);
		}
	}
}








