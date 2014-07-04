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
@RequestMapping("/photo")
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
			.setStatus("ok")
			.setData(params);
	}

	@RequestMapping("/insert")
	public AjaxResult insert(
			int memberNo,
			String photosTitle,
			String photosContent,
			@RequestParam("photoFile") MultipartFile photoFile,
			Model model) {
     try {
			PhotosVo photos = new PhotosVo();
			String fullPath = servletContext.getRealPath("/upload");
			if (!photoFile.isEmpty()) {
				String filename = 
						System.currentTimeMillis() + "_" + ++fileCount;
				File savedFile = new File(fullPath + "/" + filename);
				photoFile.transferTo(savedFile);

				photos.setMemberNo(memberNo);
				photos.setPhotosTitle(photosTitle);
				photos.setPhotosContent(photosContent);
				photos.setPhotosImg(filename);
//				model.addAttribute("photosVo", photos);
//				model.addAttribute("photoFile", filename);
				photosService.add(photos);
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
