package com.projects.controller;

import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import com.projects.service.EmailService;
import com.projects.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/test")
public class TestNotificationController {

    private final EmailService emailService;

    private final NotificationService notificationService;

    public TestNotificationController(EmailService emailService, NotificationService notificationService) {
        this.emailService = emailService;
        this.notificationService = notificationService;
    }


    @GetMapping("/simple-email")
    public ResponseEntity<String> testSimpleEmail() {
        AppUser testUser = new AppUser();
        testUser.setFirstName("Tester");
        testUser.setEmail("filipoana1604@yahoo.com");

        Subscription testSub = new Subscription();
        testSub.setName("Test Subscription (Netflix)");
        testSub.setAmount(10.0);
        testSub.setDueDate(LocalDate.now().plusDays(1)); //

        try {
            emailService.sendSubscriptionDueSoonEmail(testUser, testSub);
            return ResponseEntity.ok("E-mail de test simplu trimis cu succes!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Eroare la trimiterea e-mailului: " + e.getMessage());
        }
    }


    @GetMapping("/run-full-check")
    public ResponseEntity<String> testFullNotificationRun() {
        try {
            notificationService.checkSubscriptionsAndSendNotifications();
            return ResponseEntity.ok("Verificarea complea!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Eroare la rularea verificării: " + e.getMessage());
        }
    }
}