package com.projects.service;

import com.projects.exception.EntityAlreadyExistsException;
import com.projects.exception.EntityNotFoundException;
import com.projects.model.entity.AppUser;
import com.projects.model.entity.Subscription;
import com.projects.repository.AppUserRepository;
import com.projects.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {

    private final AppUserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionService(AppUserRepository userRepository, SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public Subscription getSubscriptionById(UUID id) {
        return subscriptionRepository.findById(id).orElse(null);
    }

    public List<Subscription> getUserSubscriptions(UUID userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return user.getSubscriptions();
    }

    public Subscription addSubscription(UUID userId, Subscription subscription) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean exists = user.getSubscriptions().stream()
                .anyMatch(sub -> sub.getName().equalsIgnoreCase(subscription.getName()));

        if (exists) {
            throw new EntityAlreadyExistsException("Subscription with name: " + subscription.getName() + " already exists");
        }

        if (subscription.getStartDate() == null) {
            subscription.setStartDate(LocalDate.now());
        }
        subscription.calculateDueDate();

        user.getSubscriptions().add(subscription);
        userRepository.save(user);

        return subscription;
    }

    public void removeSubscriptionFromAppUser(UUID userId, UUID subscriptionId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean removed = user.getSubscriptions().removeIf(sub -> sub.getId().equals(subscriptionId));
        if (!removed) {
            throw new EntityNotFoundException("Subscription with id: " + subscriptionId + " not found for user.");
        }
        userRepository.save(user);
    }

    public Subscription updateSubscription(UUID userId, UUID subscriptionId, Subscription updatedSub) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Subscription existingSub = user.getSubscriptions().stream()
                .filter(sub -> sub.getId().equals(subscriptionId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Subscription with id: " + subscriptionId + " not found for user."));

        existingSub.setName(updatedSub.getName());
        existingSub.setAmount(updatedSub.getAmount());
        existingSub.setStartDate(updatedSub.getStartDate());
        existingSub.setType(updatedSub.getType());
        existingSub.calculateDueDate();

        userRepository.save(user);
        return existingSub;
    }
}