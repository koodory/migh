package migh.controls.ajax;

import java.io.File;
import java.util.HashMap;

import javax.servlet.ServletContext;

import migh.services.PhotosService;
import migh.vo.AjaxResult;
import migh.vo.PhotosVo;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/photos")
public class PhotosControl {
	static Logger log = Logger.getLogger(PhotosControl.class);
	static long fileCount;
	
	@Autowired
	ServletContext servletContext;

	@Autowired
	PhotosService photosService;
		
	public PhotosControl() {
		log.debug("PhotosControl 생성됨");
	}

	@RequestMapping("/list")
	public AjaxResult list(
			@RequestParam(value="pageNo",defaultValue="1") int pageNo, 
			@RequestParam(value="pageSize",defaultValue="5") int pageSize) {
		
		HashMap<String,Object> params = new HashMap<String,Object>();
		params.put("count", photosService.count());
        params.put("list",  photosService.list(pageNo, pageSize));

		return new AjaxResult()
			.setStatus(" ok")
			.setData(params);
	}
	
//	 @RequestMapping(value="/upload", method=RequestMethod.POST)
//		public String execute(PhotosVo photos,
//				@RequestParam("file1") MultipartFile file1,
//				Model model) {
//			try {
//				String fullPath = servletContext.getRealPath("/upload");
//				if (!file1.isEmpty()) {
//					String filename = 
//							System.currentTimeMillis() + "_" + ++fileCount;
//					File savedFile = new File(fullPath + "/" + filename);
//					file1.transferTo(savedFile);
//					//					model.addAttribute("index", index);
//					model.addAttribute("photosVo", photos);
//					model.addAttribute("file1name", filename);
//					System.out.println("포토스 : " + photos);
//				  						
//					photosService.upload(photos , filename);
//				}
//				return "file/uploadResult";
//			
//			} catch (Throwable ex) {
//				throw new Error(ex);
//			}
//		}
	
//	@RequestMapping(value="/insert", method=RequestMethod.POST)
//	public AjaxResult insert(PhotosVo photos) {		
//		photosService.add(photos);
//		return new AjaxResult().setStatus("ok");
//	}
//	
	
	@RequestMapping(value="/insert", method=RequestMethod.POST)
	public AjaxResult insert(
			int memberNo,
			String photosTitle,
			String photosContent,
			@RequestParam("file1") MultipartFile file1
//			Model model
			) {
		
		try {
			PhotosVo photos = new PhotosVo();
			String fullPath = servletContext.getRealPath("/insert");
			if (!file1.isEmpty()) {
				String filename = 
						System.currentTimeMillis() + "_" + ++fileCount;
				File savedFile = new File(fullPath + "/" + filename);
				file1.transferTo(savedFile);
				
				photos.setMemberNo(memberNo);
				photos.setPhotosTitle(photosTitle);
				photos.setPhotosContent(photosContent);
				photos.setPhotosImg(filename);
				photosService.add(photos);
				System.out.println("vo에 담긴 값 확인 :" + photos.toString());
//				model.addAttribute("photosVo", photos);
//				model.addAttribute("file1name", filename);
			}
			return new AjaxResult().setStatus("ok");
		
		} catch (Throwable ex) {
			throw new Error(ex);
		}
	}

	@RequestMapping(value="/update", method=RequestMethod.POST)
	public AjaxResult update(PhotosVo vo, Model model) {
		photosService.change(vo);
		return new AjaxResult().setStatus("ok");
	}

	@RequestMapping(value="/delete", method=RequestMethod.POST)
	public AjaxResult delete(PhotosVo vo) {
		photosService.remove(vo);
		return new AjaxResult().setStatus("ok");
	}
}
