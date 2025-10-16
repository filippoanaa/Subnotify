package com.projects.controller;

import com.projects.exception.EntityAlreadyExistsException;
import com.projects.model.dto.UpdatePasswordRequest;
import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import com.projects.service.AppUserService;
import com.projects.service.SubscriptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    private final AppUserService userService;
    private final SubscriptionService subscriptionService;

    @Autowired
    public AppUserController(AppUserService userService, SubscriptionService subscriptionService) {
        this.userService = userService;
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getAppUserById(@PathVariable UUID userId) {
        try {
            AppUser user = userService.getAppUserById(userId);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/{userId}/password")
    public ResponseEntity<?> updateAppUserPassword(@PathVariable UUID userId, @RequestBody UpdatePasswordRequest newPassword) {
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
    public ResponseEntity<?> deleteAppUser(@PathVariable UUID userId) {
        try {
            userService.deleteAppUserById(userId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("AppUser deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ================== SUBSCRIPTIONS CRUD ==================

    @GetMapping("/{userId}/subscriptions")
    public ResponseEntity<List<Subscription>> getAppUsersSubscriptions(@PathVariable UUID userId) {
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping("/{userId}/subscriptions")
    public ResponseEntity<?> addSubscriptionToUser(
            @PathVariable UUID userId,
            @RequestBody Subscription subscription
    ) {
        try {
            Subscription created = subscriptionService.addSubscription(userId, subscription);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (EntityAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Subscription already exists: " + e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/subscriptions/{subscriptionId}")
    public ResponseEntity<?> deleteSubscriptionFromUser(
            @PathVariable UUID userId,
            @PathVariable UUID subscriptionId
    ) {
        try {
            subscriptionService.removeSubscriptionFromAppUser(userId, subscriptionId);
            return ResponseEntity.ok("Subscription deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/subscriptions/{subscriptionId}")
    public ResponseEntity<?> updateSubscription(
            @PathVariable UUID userId,
            @PathVariable UUID subscriptionId,
            @RequestBody Subscription updatedSub
    ) {
        try {
            Subscription updated = subscriptionService.updateSubscription(userId, subscriptionId, updatedSub);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found: " + e.getMessage());
        }
    }
}