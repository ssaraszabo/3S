package com.example.backend.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "avatars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avatar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
    
    @Column(name = "unlock_criteria", nullable = false)
    private int unlockCriteria;  
    
    public Avatar(String name, String imageUrl, int unlockCriteria) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.unlockCriteria = unlockCriteria;
    }
}
