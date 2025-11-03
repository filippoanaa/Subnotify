package com.projects.service;

import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public void sendSubscriptionDueSoonEmail(AppUser user, Subscription subscription) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("SubNotify Reminder: Subscription Due Soon!");

        String text = String.format(
                """
                        Hello %s,
                        
                        This is a reminder that your subscription for '%s' \
                        is due on %s for the amount of €%.2f.
                        
                        Thank you for using SubNotify!""",
                user.getFirstName(),
                subscription.getName(),
                subscription.getDueDate(),
                subscription.getAmount()
        );
        message.setText(text);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error sending email to " + user.getEmail() + ": " + e.getMessage());
        }
    }
}