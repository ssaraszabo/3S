package com.example.backend.service;
import org.springframework.stereotype.Service;

import com.example.backend.model.Avatar;
import com.example.backend.repository.AvatarRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AvatarService {
    private final AvatarRepository avatarRepository;
    
    public Avatar getDefaultAvatar() {
        return avatarRepository.findByUnlockCriteria(0)
            .orElseThrow(() -> new RuntimeException("Default avatar not found"));
    }
    
    public Avatar createIfNotExists(String name, int threshold, String imageUrl) {
        return avatarRepository.findByName(name)
            .orElseGet(() -> {
                Avatar a = new Avatar();
                a.setName(name);
                a.setUnlockCriteria(threshold);
                a.setImageUrl(imageUrl);
                return avatarRepository.save(a);
            });
    }
}
