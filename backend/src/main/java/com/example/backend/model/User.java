package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private @Getter @ Setter String email;
    private @Getter @Setter String password;
    private @Getter @Setter String username;
    private @Getter @Setter int nrFocusSessions;
    private @Getter @Setter int totalFocusTime;
    private @Getter @Setter int nrFocusSessionsToday;
    private @Getter @Setter String focusTimeToday;
    private @Getter @Setter String avatar;

    public User(String email, String password, String username, int nrFocusSessions, int totalFocusTime, int nrFocusSessionsToday, String focusTimeToday, String avatar) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.nrFocusSessions = nrFocusSessions;
        this.totalFocusTime = totalFocusTime;
        this.nrFocusSessionsToday = nrFocusSessionsToday;
        this.focusTimeToday = focusTimeToday;
        this.avatar = avatar;
    }

    
}