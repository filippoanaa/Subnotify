package com.projects.service;

import com.projects.model.entity.AppUser;
import com.projects.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    @Autowired
    private AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepository.findAppUsersByEmail(username);
        if(appUser != null) {
            return User.builder()
                    .username(appUser.getEmail())
                    .password(appUser.getPassword())
                    .build();
        }else{
            throw new UsernameNotFoundException(username);
        }
    }
}
