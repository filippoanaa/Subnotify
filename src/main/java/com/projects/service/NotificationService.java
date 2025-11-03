package com.projects.service;

import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import com.projects.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    private final SubscriptionRepository subscriptionRepository;
    private final EmailService emailService;

    public NotificationService(SubscriptionRepository subscriptionRepository, EmailService emailService) {
        this.subscriptionRepository = subscriptionRepository;
        this.emailService = emailService;
    }


    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional
    public void checkSubscriptionsAndSendNotifications() {
        LocalDate today = LocalDate.now();

        List<Subscription> staleSubs = subscriptionRepository.findByDueDateBefore(today);

        for (Subscription sub : staleSubs) {
            sub.calculateDueDate();
        }
        subscriptionRepository.saveAll(staleSubs);


        LocalDate threeDaysFromNow = today.plusDays(3);

        List<Subscription> dueSubscriptions = subscriptionRepository.findByDueDateBetween(today, threeDaysFromNow);

        for (Subscription sub : dueSubscriptions) {
            AppUser user = sub.getUser();

            if (user != null) {
                System.out.println("Subscription '" + sub.getName() + "' for user " + user.getEmail() + " is due soon. Sending email.");
                emailService.sendSubscriptionDueSoonEmail(user, sub);
            } else {
                System.err.println("Orphan subscription found (ID: " + sub.getId() + "). Skipping notification.");
            }
        }
        System.out.println("Finished scheduled check. " + dueSubscriptions.size() + " notifications sent.");
    }
}