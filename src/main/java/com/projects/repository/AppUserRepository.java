package com.projects.repository;

import com.projects.model.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    boolean existsByEmail(String email);
    AppUser findByEmail(String email);
}
