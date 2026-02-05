package com.Service;

import com.DTO.AllFavouritesRequestDTO;
import com.DTO.CheckGifInDBRequestDTO;
import com.DTO.FavouriteRequestDTO;
import com.DTO.RegisterRequestDTO;
import com.Entity.Favourite;
import com.Entity.User;
import com.Repository.FavRepository;
import com.Repository.UserRepository;
import com.Security.SecurityConfig;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.ClientInfoStatus;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    UserRepository userRepository;
    FavRepository favRepository;
    PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, FavRepository favRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.favRepository = favRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, String> addFavouriteService(FavouriteRequestDTO favouriteRequestDTO) {
        if (favouriteRequestDTO.userId() == 0) return null;

        if (findById(favouriteRequestDTO.userId()).isEmpty()) return null;

        if (favRepository.findById(favouriteRequestDTO.id()).isPresent()) {
            favRepository.deleteById(favouriteRequestDTO.id());
            return Map.of("status", "ok");
        }

        Favourite favourite = new Favourite();
        favourite.setUser(findById(favouriteRequestDTO.userId()).get());
        favourite.setFullData(favouriteRequestDTO.fullData());
        favourite.setId(favouriteRequestDTO.id());

        favRepository.save(favourite);

        return Map.of("status", "ok");
    }

    public List<? extends Map<?, ?>> getAllFavouritesService(AllFavouritesRequestDTO allFavouritesRequestDTO) throws JsonProcessingException {
        if (findById(allFavouritesRequestDTO.userId()).isEmpty() || favRepository.findAllByUserId(allFavouritesRequestDTO.userId()).isEmpty())
            return List.of(Map.of("data", "empty"));

        return favRepository.findAllByUserId(allFavouritesRequestDTO.userId()).stream()
                .map(x ->
                        Map.of("id", x.getId(), "fullData", x.getFullData())
                )
                .toList();
    }

    public Map<String, Boolean> checkGifInDBService(CheckGifInDBRequestDTO checkGifInDBRequestDTO) {
        return Map.of("data", favRepository.findAllByUserId(checkGifInDBRequestDTO.userId()).stream()
                .map(Favourite::getId)
                .toList()
                .contains(checkGifInDBRequestDTO.id()));
    }

    public Map<String, Boolean> checkGifInDBService(Long id, Long userId) {
        return Map.of("data", favRepository.findAllByUserId(userId).stream()
                .map(Favourite::getId)
                .toList()
                .contains(id));
    }

    public Map<String, String> registerService(RegisterRequestDTO registerRequestDTO) {
        if (registerRequestDTO.username() != null) {
            if (findByUsername(registerRequestDTO.username()).isEmpty()) {

                BCryptPasswordEncoder encoder = SecurityConfig.passwordEncoder();
                User user = new User();
                user.setUsername(registerRequestDTO.username());
                user.setEmail(registerRequestDTO.email());
                user.setPassword(encoder.encode(registerRequestDTO.password()));

                save(user);

                return Map.of("status", "ok");
            }
        } else {
            if (findByEmail(registerRequestDTO.email()).isEmpty()) {

                BCryptPasswordEncoder encoder = SecurityConfig.passwordEncoder();
                User user = new User();
                user.setUsername(null);
                user.setEmail(registerRequestDTO.email());
                user.setPassword(encoder.encode(registerRequestDTO.password()));

                save(user);

                return Map.of("status", "ok");
            }
        }

        return Map.of("status", "fail");
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public boolean save(User user) {
        try {
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
