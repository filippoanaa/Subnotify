package com.projects.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints  = {
        @UniqueConstraint(columnNames = "email"),
})
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;


    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)    @JoinColumn(name = "user_id")
    @JsonManagedReference
    private List<Subscription> subscriptions = new ArrayList<>();


    @Override
    public String toString() {
        return "AppUser [id=" + id + ", lastName=" + lastName + ", firstName=" + firstName + ", email=" + email  + "]";
    }
}
