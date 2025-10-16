package com.projects.service;


import com.projects.config.JWTUtil;
import com.projects.exception.EntityAlreadyExistsException;
import com.projects.exception.EntityNotFoundException;
import com.projects.exception.ValidationException;
import com.projects.model.dto.RegisterRequest;
import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import com.projects.model.mapper.UserMapper;
import com.projects.repository.AppUserRepository;
import com.projects.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AppUserService {

    private AppUserRepository userRepository;
    private SubscriptionRepository subscriptionRepository;

    private PasswordEncoder passwordEncoder;

    private UserMapper userMapper;

    @Autowired
    public AppUserService(AppUserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.subscriptionRepository = subscriptionRepository;

    }

    public AppUser createAppUser(RegisterRequest reuqestUser) throws ValidationException {
        if (userRepository.existsByEmail(reuqestUser.getEmail()))
            throw new EntityAlreadyExistsException("An user with email: " + reuqestUser.getEmail() + " already exists");
        if (!reuqestUser.getPassword().equals(reuqestUser.getPasswordConfirmation())) {
            throw new ValidationException("Passwords do not match");
        }
        AppUser user = userMapper.toEntity(reuqestUser);
        user.setPassword(passwordEncoder.encode(reuqestUser.getPassword()));

        return userRepository.save(user);
    }


    public AppUser getAppUserById(UUID id) {
        return userRepository.findById(id).get();
    }


    public void updateAppUser(UUID  userId, String oldPassword, String newPassword) {
        AppUser user = userRepository.findById(userId).get();
        if(user == null)
            throw new EntityNotFoundException("AppUser not found");
        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            throw new BadCredentialsException("Wrong password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteAppUserById(UUID id) {
        userRepository.deleteById(id);
    }

    public List<AppUser> getAllAppUsers() {
        return userRepository.findAll();
    }

    public AppUser findByEmail(String email) {
        AppUser user = userRepository.findAppUsersByEmail(email);
        if(user == null){
            throw new EntityNotFoundException("AppUser with email: " + email + " not found");
        }

        return user;
    }



}
