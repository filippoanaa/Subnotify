package com.projects.repository;

import com.projects.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findSubscriptionsByUserId(Long id);


}
