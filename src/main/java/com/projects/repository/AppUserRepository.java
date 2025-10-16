package com.projects.repository;

import com.projects.model.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    boolean existsByEmail(String email);

    AppUser findAppUsersByEmail(String email);
}
