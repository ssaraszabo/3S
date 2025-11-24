package com.example.backend.config;

import com.example.backend.model.Avatar;
import com.example.backend.repository.AvatarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AvatarDataSeeder implements CommandLineRunner {
    private final AvatarRepository avatarRepository;
    
    @Override
    public void run(String... args) {
        if (avatarRepository.count() == 0) {
            avatarRepository.saveAll(List.of(
                new Avatar("Leaf", "avatar1", 0),
                new Avatar("PineCone", "avatar2", 10),
                new Avatar("Mushroom", "avatar3", 20)
            ));
        }
    }
}