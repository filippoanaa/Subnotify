package com.projects.service;

import com.projects.exception.EntityAlreadyExistsException;
import com.projects.exception.EntityNotFoundException;
import com.projects.model.Subscription;
import com.projects.model.User;
import com.projects.repository.SubscriptionRepository;
import com.projects.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class SubscriptionService {

    private SubscriptionRepository subscriptionRepository;

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository, UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        updateDueDates();
    }

    private void updateDueDates() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        subscriptions.forEach(Subscription::calculateDueDate);
        subscriptionRepository.saveAll(subscriptions);
    }

    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id).orElse(null);
    }

    public void addSubscriptionToUser(Long userId, Subscription subscription) {
        User user = userRepository.findById(userId).get();

        boolean exists = user.getSubscriptions().stream()
                .anyMatch(sub -> sub.getName().equals(subscription.getName()));

        if (!exists) {
            if (subscription.getStartDate() == null) {
                subscription.setStartDate(LocalDate.now());
            }
            subscription.calculateDueDate();
            subscription.setUser(user);
            subscriptionRepository.save(subscription);
        } else {
            throw new EntityAlreadyExistsException("Subscription with name: " + subscription.getName() + " already exists");
        }
    }



    public Subscription updateSubscription(Subscription subscription, Long subscriptionId, Long userId) throws AccessDeniedException {
        Subscription subs = subscriptionRepository.findById(subscriptionId).orElse(null);
        if(subs == null){
            throw new EntityNotFoundException("Subscription with id: " + subscription.getId() + " not found");
        }
        if(!subs.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User doesn't have the permission to update the subscription.");
        }
        subs.setName(subscription.getName());
        subs.setAmount(subscription.getAmount());
        subs.setStartDate(subscription.getStartDate());
        subs.setType(subscription.getType());
        subs.calculateDueDate();
        subscriptionRepository.save(subs);
        return subs;

    }

    public List<Subscription> paymentIn3Days(Long userId) {
        List<Subscription> subscriptions = subscriptionRepository.findSubscriptionsByUserId(userId);
        List<Subscription> toPay = new ArrayList<>();
        LocalDate now = LocalDate.now();
        LocalDate threeDaysLater = now.plusDays(3);

        subscriptions.forEach(subscription -> {
            if (!subscription.getDueDate().isBefore(now) && subscription.getDueDate().isBefore(threeDaysLater)) {
                toPay.add(subscription);
            }
        });
        return toPay;


    }


    public void removeSubscriptionFromUser(Long userId, Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId).orElse(null);
        if(subscription == null || !Objects.equals(subscription.getUser().getId(), userId)) {
            throw new EntityNotFoundException("Subscription with id: " + subscriptionId + "not found for user.");
        }
        userRepository.findById(userId).ifPresent(user -> user.getSubscriptions().remove(subscription));
        subscriptionRepository.deleteById(subscriptionId);
    }

    public List<Subscription> getAll() {
        return subscriptionRepository.findAll();
    }

    public List<Subscription> getUsersSubscriptions(Long userId) {
        return subscriptionRepository.findSubscriptionsByUserId(userId);
    }
}