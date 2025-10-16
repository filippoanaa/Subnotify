package com.projects.controller;

import com.projects.exception.EntityAlreadyExistsException;
import com.projects.model.dto.SubscriptionRequest;
import com.projects.model.entity.Subscription;
import com.projects.service.SubscriptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{subscriptionId}")
    public ResponseEntity<?> getSubscription(@PathVariable UUID subscriptionId) {
        try {
            Subscription subscription = subscriptionService.getSubscriptionById(subscriptionId);
            if(subscription == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(subscription);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subscription not found: " + e.getMessage());
        }
    }



}