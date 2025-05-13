package com.projects.service;


import com.projects.exception.EntityAlreadyExistsException;
import com.projects.model.Subscription;
import com.projects.model.User;
import com.projects.repository.SubscriptionRepository;
import com.projects.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        passwordEncoder = new BCryptPasswordEncoder();
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new EntityAlreadyExistsException("An user with email: " + user.getEmail() + " already exists");
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }


    public User getUserById(Long id) {
        return userRepository.findById(id).get();
    }


    public void updateUser(long  userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId).get();
        if(user == null)
            throw new EntityNotFoundException("User not found");
        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            throw new BadCredentialsException("Wrong password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new EntityNotFoundException("User with email: " + email + " not found");
        }
        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new BadCredentialsException("Bad credentials");
        }
        return user;
    }


}
