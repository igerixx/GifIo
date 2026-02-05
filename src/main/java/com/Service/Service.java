package com.Service;

import com.DTO.SearchRequestDTO;
import com.DTO.TrendingRequestDTO;
import com.Entity.User;
import com.Repository.FavRepository;
import com.Repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {
    private final int limit = 16 * 1;
    public int offset = 0;
    private int page = 1;
    private String lastRequest;
    private boolean isStartLoaded = false;
    private User user = null;
    public int lastAction = 0;

    private UserService userService;

    public Service(UserService userService) {
        this.userService = userService;
    }

    public String startLoadService(TrendingRequestDTO trendingRequestDTO) throws IOException, InterruptedException {
        if (lastAction != 0 || trendingRequestDTO.isReloadedPage()) {
            page = 0;
            lastAction = 0;
        }

        if (isStartLoaded) {
            page++;
        } else {
            isStartLoaded = true;
        }

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder(URI.create(
                "https://api.klipy.com/api/v1/" +
                        "sa0mhlMoKF9bzWNfYohHhU1vSSr1JAhI7mGgXbzF3cbtNfXbi2zRWQ7sd93GFu21" +
                        "/gifs/trending?" +
                        "page=" + page +
                        "&per_page=" + limit
        )).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }

    public String searchService(SearchRequestDTO searchRequestDTO) throws IOException, InterruptedException {
        if (lastAction != 1) {
            page = 0;
            lastAction = 1;
        }

        isStartLoaded = false;

        if (lastRequest != null && lastRequest.equals(searchRequestDTO.request().replace(" ", "_"))) {
            page++;
        } else {
            page = 1;
            lastRequest = searchRequestDTO.request().replace(" ", "_");
        }

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder(URI.create(
                "https://api.klipy.com/api/v1/" +
                        "sa0mhlMoKF9bzWNfYohHhU1vSSr1JAhI7mGgXbzF3cbtNfXbi2zRWQ7sd93GFu21" +
                        "/gifs/search?" +
                        "&page=" + page +
                        "&per_page=" + limit +
                        "&q=" + lastRequest
        )).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }

    public Map<String, Object> authCheckService() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth.getPrincipal().equals("anonymousUser"))
            return Map.of("info", "Sign in", "userId", 0);

        if (user != null && user.getId().longValue() != ((User) auth.getPrincipal()).getId().longValue())
            this.offset = 0;

        user = (User) auth.getPrincipal();

        String info = user.getEmail() != null ? user.getEmail() : user.getUsername();

        return Map.of("info", info, "userId", user.getId());
    }
}
