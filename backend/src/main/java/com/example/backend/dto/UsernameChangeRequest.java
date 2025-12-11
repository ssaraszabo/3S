package com.example.backend.dto;

import lombok.Data;

@Data
public class UsernameChangeRequest {
    private String newUsername;
    private String password;
}