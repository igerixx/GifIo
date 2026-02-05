package com.Controller;

import com.DTO.*;
import com.Entity.Favourite;
import com.Entity.User;
import com.Service.Service;
import com.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@org.springframework.stereotype.Controller
public class Controller {
    private final Service service;
    private final UserService userService;

    public Controller(Service service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @ResponseBody
    @PostMapping("/trending")
    public String startLoadController(@RequestBody TrendingRequestDTO trendingRequestDTO) throws IOException, InterruptedException {
        return service.startLoadService(trendingRequestDTO);
    }

    @ResponseBody
    @PostMapping("/search")
    public String searchController(@RequestBody SearchRequestDTO searchRequestDTO) throws IOException, InterruptedException {
        return service.searchService(searchRequestDTO);
    }

    @ResponseBody
    @PostMapping("/favourite")
    public Map<String, String> addFavouriteController(@RequestBody FavouriteRequestDTO favouriteRequestDTO) throws JsonProcessingException {
        return userService.addFavouriteService(favouriteRequestDTO);
    }

    @ResponseBody
    @PostMapping("/allFavourites")
    public List<? extends Map<?, ?>> getAllFavouritesController(@RequestBody AllFavouritesRequestDTO allFavouritesRequestDTO) throws JsonProcessingException {
        service.lastAction = 2;
        return userService.getAllFavouritesService(allFavouritesRequestDTO);
    }

    @ResponseBody
    @PostMapping("/checkGif")
    public Map<String, Boolean> checkGifInDBController(@RequestBody CheckGifInDBRequestDTO checkGifInDBRequestDTO) {
        return userService.checkGifInDBService(checkGifInDBRequestDTO);
    }

    @ResponseBody
    @PostMapping("/register")
    public Map<String, String> registerController(@RequestBody RegisterRequestDTO registerRequestDTO) {
        return userService.registerService(registerRequestDTO);
    }

    @ResponseBody
    @PostMapping("/authentication")
    public Map<String, Object> getAuthenticationController() {
        return service.authCheckService();
    }
}
