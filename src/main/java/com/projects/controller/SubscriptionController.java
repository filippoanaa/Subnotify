package com.projects.controller;

import com.projects.exception.EntityAlreadyExistsException;
import com.projects.model.entity.Subscription;
import com.projects.service.SubscriptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/subscriptions/{subscriptionId}")
    public ResponseEntity<?> getSubscription(@PathVariable Long subscriptionId) {
        try {
            Subscription subscription = subscriptionService.getSubscriptionById(subscriptionId);
            return ResponseEntity.ok(subscription);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/subscriptions")
    public ResponseEntity<List<Subscription>> getAppUsersSubscriptions(@PathVariable Long userId) {
        List<Subscription> subscriptions = subscriptionService.getAppUsersSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping("/users/{userId}/subscriptions")
    public ResponseEntity<?> addSubscriptionToAppUser(@RequestBody Subscription subscription, @PathVariable Long userId) {
        try {
            System.out.println("Incerc sa adaug");
            subscriptionService.addSubscriptionToAppUser(userId, subscription);
            return ResponseEntity.status(HttpStatus.CREATED).body("Subscription added successfully");
        } catch (EntityAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Subscription already exists: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}/subscriptions/{subscriptionId}")
    public ResponseEntity<?> deleteSubscriptionFromAppUser(@PathVariable Long userId, @PathVariable Long subscriptionId) {
        try {
            subscriptionService.removeSubscriptionFromAppUser(userId, subscriptionId);
            return ResponseEntity.ok("Subscription deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/subscriptions/{subscriptionId}")
    public ResponseEntity<?> updateSubscription(@RequestBody Subscription subscription, @PathVariable Long subscriptionId, @PathVariable Long userId) {
        try {
            Subscription updatedSubscription = subscriptionService.updateSubscription(subscription, subscriptionId, userId);
            return ResponseEntity.ok(updatedSubscription);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found: " + e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/subscriptions/paymentDueSoon")
    public ResponseEntity<List<Subscription>> getSubscriptionsDueSoon(@PathVariable Long userId) {
        List<Subscription> subscriptions = subscriptionService.paymentIn3Days(userId);
        System.out.println("Calculez due dates: " + subscriptions.size());
        if (!subscriptions.isEmpty()) {
            return ResponseEntity.ok(subscriptions);
        }
        return ResponseEntity.noContent().build();
    }
}