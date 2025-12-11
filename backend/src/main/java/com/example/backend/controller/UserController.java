package com.example.backend.controller;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

import com.example.backend.dto.PasswordChangeRequest;
import com.example.backend.dto.UsernameChangeRequest;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;


    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterRequest request) {
        try {
            System.out.println("Received registration request: " + request);
            User registeredUser = userService.registerUser(request);
            System.out.println("User registered successfully: " + registeredUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<User> signinUser(@RequestBody LoginRequest request) {
        try {
            System.out.println("Received signin request: " + request);
            User signedInUser = userService.signinUser(request);
            System.out.println("User signed in successfully: " + signedInUser);
            return ResponseEntity.ok(signedInUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<ArrayList<String>> getProfileInfo(@RequestParam Long userId) {
        try {
            System.out.println("Received profile info request for user ID: " + userId);
            ArrayList<String> profileInfo = userService.getProfileInfo(userId);
            System.out.println("Profile info retrieved successfully: " + profileInfo);
            return ResponseEntity.ok(profileInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/change-password/{userId}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody PasswordChangeRequest request) {
        System.out.println("Received password change request for user ID: " + userId);
        try {
            userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
            System.out.println("Password changed successfully for user ID: " + userId);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            System.err.println("Password change failed for user ID " + userId + ": " + e.getMessage());
            String message = e.getMessage() != null ? e.getMessage() : "Unknown error";
            if (message.toLowerCase().contains("incorrect old password")) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(java.util.Collections.singletonMap("message", "Incorrect old password."));
            } else if (message.toLowerCase().contains("not found")) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(java.util.Collections.singletonMap("message", message));
            } else {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(java.util.Collections.singletonMap("message", "Internal server error during password change."));
            }
        }
    }

    @PutMapping("/change-username/{userId}")
    public ResponseEntity<?> changeUsername(
            @PathVariable Long userId,
            @RequestBody UsernameChangeRequest request) {
        System.out.println("Received username change request for user ID: " + userId + " with new username: " + request.getNewUsername());

        try {
            userService.changeUsername(userId, request.getNewUsername(), request.getPassword());
            System.out.println("Username changed successfully for user ID: " + userId);
            return ResponseEntity.ok(java.util.Collections.singletonMap("newUsername", request.getNewUsername()));
        } catch (RuntimeException e) {
            System.err.println("Username change failed for user ID " + userId + ": " + e.getMessage());
            String message = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
            if (message.contains("incorrect password")) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(java.util.Collections.singletonMap("message", "Incorrect password provided."));
            } else if (message.contains("username already exists")) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(java.util.Collections.singletonMap("message", e.getMessage()));
            } else if (message.contains("not found")) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(java.util.Collections.singletonMap("message", message));
            } else {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(java.util.Collections.singletonMap("message", "Internal server error during username change."));
            }
        }
    }
}