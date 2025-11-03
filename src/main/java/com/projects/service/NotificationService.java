package com.projects.service;

import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import com.projects.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private final AppUserRepository appUserRepository;

    private final EmailService emailService;

    public NotificationService(AppUserRepository appUserRepository, EmailService emailService) {
        this.appUserRepository = appUserRepository;
        this.emailService = emailService;
    }

    private boolean isDueSoon(LocalDate dueDate) {
        if (dueDate == null) return false;
        LocalDate today = LocalDate.now();
        long daysUntilDue = ChronoUnit.DAYS.between(today, dueDate);

        return daysUntilDue >= 0 && daysUntilDue <= 3;
    }

    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional
    public void checkSubscriptionsAndSendNotifications() {
        System.out.println("Running scheduled check for subscription due dates...");
        List<AppUser> users = appUserRepository.findAll();

        for (AppUser user : users) {
            for (Subscription sub : user.getSubscriptions()) {
                if (isDueSoon(sub.getDueDate())) {
                    System.out.println("Subscription '" + sub.getName() + "' for user " + user.getEmail() + " is due soon. Sending email.");
                    emailService.sendSubscriptionDueSoonEmail(user, sub);
                }
            }
        }
    }
}