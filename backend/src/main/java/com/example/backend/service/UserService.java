package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Avatar;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.repository.AvatarRepository;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AvatarService avatarService;
    private final AvatarRepository avatarRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); 
        user.setUsername(request.getUsername());
        user.setNrFocusSessions(0);
        user.setTotalFocusTime(0);
        user.setNrFocusSessionsToday(0);
        user.setFocusTimeToday("0");
        user.setAvatar(avatarService.getDefaultAvatar());
        
        return userRepository.save(user);
    }


    public User updateAvatarForUser(User user) {
        Avatar unlocked = avatarRepository.findBestBySessions(user.getNrFocusSessions())
            .orElseGet(() -> avatarService.getDefaultAvatar());
        user.setAvatar(unlocked);
        return userRepository.save(user);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}