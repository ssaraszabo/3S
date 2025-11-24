package com.example.backend.repository;

import com.example.backend.model.Avatar;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AvatarRepository extends JpaRepository<Avatar, Long> {
    Optional<Avatar> findByName(String name);
    boolean existsByName(String name);
    
    @Query("SELECT a FROM Avatar a WHERE a.unlockCriteria <= :sessions ORDER BY a.unlockCriteria DESC")
    Optional<Avatar> findBestBySessions(@Param("sessions") int sessions);
    
    Optional<Avatar> findByUnlockCriteria(int n);
}
