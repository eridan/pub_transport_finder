package publictransport.finder.map.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomePageController {

    @RequestMapping("/mainPage")
    public String hello(@RequestParam(value = "name", required = false, defaultValue = "User") String name, Model model) {
        model.addAttribute("name", name);
        return "index";
    }

}
