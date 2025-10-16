package com.projects.model.dto;

import com.projects.model.entity.SubscriptionType;

import java.time.LocalDate;
import java.util.UUID;

public class SubscriptionRequest {
    private UUID id;
    private String name;
    private LocalDate startDate;
    private SubscriptionType type;
    private UUID appUserId;

    public SubscriptionRequest(UUID id, String name, LocalDate startDate, SubscriptionType type, UUID appUserId) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.type = type;
        this.appUserId = appUserId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public SubscriptionType getType() {
        return type;
    }

    public UUID getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(UUID appUserId) {
        this.appUserId = appUserId;
    }

    public void setType(SubscriptionType type) {
        this.type = type;
    }
}
