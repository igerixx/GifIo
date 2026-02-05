package com.Security;

import com.Entity.User;
import com.Service.Service;
import com.Service.UserService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CustomAuthProvider implements AuthenticationProvider {

    private final UserService userService;

    public CustomAuthProvider(UserService userService) {
        this.userService = userService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        User user;

        if (!username.contains("@")) {
            user = userService.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("User with this username does not exists!"));
        } else {
            user = userService.findByEmail(username)
                    .orElseThrow(() -> new BadCredentialsException("User with this email does not exists!"));
        }

        if (!userService.checkPassword(user, password)) {
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(
                user,
                password
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
