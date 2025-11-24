package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Avatar;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend.dto.LoginRequest;
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

    public User signinUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!verifyPassword(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setPassword(null);
        return user;
    }


    public ArrayList<String> getProfileInfo (Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ArrayList<String> profileInfo = new ArrayList<>();
        profileInfo.add(user.getUsername());
        profileInfo.add(user.getEmail());
        profileInfo.add(String.valueOf(user.getNrFocusSessions()));
        profileInfo.add(String.valueOf(user.getTotalFocusTime()));
        profileInfo.add(String.valueOf(user.getNrFocusSessionsToday()));
        profileInfo.add(user.getFocusTimeToday());
        profileInfo.add(user.getAvatar());

        return profileInfo;
    }
}