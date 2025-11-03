package com.projects.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscriptions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "user_id"})
})
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private SubscriptionType type;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonBackReference
    private AppUser user;


    public void calculateDueDate() {
        if (this.startDate != null && this.type != null) {
            LocalDate nextDueDate = this.startDate;
            LocalDate today = LocalDate.now();

            switch (this.type) {
                case Monthly:
                    while (!nextDueDate.isAfter(today)) {
                        nextDueDate = nextDueDate.plusMonths(1);
                    }
                    break;
                case Yearly:
                    while (!nextDueDate.isAfter(today)) {
                        nextDueDate = nextDueDate.plusYears(1);
                    }
                    break;
                case Weekly:
                    while (!nextDueDate.isAfter(today)) {
                        nextDueDate = nextDueDate.plusWeeks(1);
                    }
                    break;
                default:
                    break;
            }
            this.dueDate = nextDueDate;
        }
    }

    @PrePersist
    public void prePersist() {
        this.calculateDueDate();
    }

    @Override
    public String toString() {
        return " | Subscription [id=" + id + ", name=" + name + ", amount=" + amount + "|";
    }
}