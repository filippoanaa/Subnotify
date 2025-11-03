package com.projects.repository;

import com.projects.model.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    List<Subscription> findByDueDateBefore(LocalDate today);
    List<Subscription> findByDueDateBetween(LocalDate startDate, LocalDate endDate);

}
