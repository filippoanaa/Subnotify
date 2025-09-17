package com.projects.controller;

import com.projects.exception.EntityAlreadyExistsException;
import com.projects.model.entity.AppUser;
import com.projects.model.dto.LoginRequest;
import com.projects.model.dto.UpdatePasswordRequest;
import com.projects.service.AppUserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService userService;

    @Autowired
    public AppUserController(AppUserService userService) {
        this.userService = userService;
    }



    @GetMapping("/{userId}")
    public ResponseEntity<?> getAppUserById(@PathVariable Long userId) {
        try {
            AppUser user = userService.getAppUserById(userId);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updateAppUserPassword(@PathVariable Long userId, @RequestBody UpdatePasswordRequest newPassword) {
        try {
            userService.updateAppUser(userId, newPassword.getOldPassword(), newPassword.getNewPassword());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Password updated successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteAppUser(@PathVariable Long userId) {
        try {
            userService.deleteAppUserById(userId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("AppUser deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}