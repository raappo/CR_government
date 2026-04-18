package com.civic.grievance.service;

import com.civic.grievance.dto.AuthResponse;
import com.civic.grievance.dto.LoginRequest;
import com.civic.grievance.dto.RegisterRequest;
import com.civic.grievance.entity.User;
import com.civic.grievance.exception.BadRequestException;
import com.civic.grievance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole())
                .contactNumber(request.getContactNumber())
                .address(request.getAddress())
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .message("User registered successfully")
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return AuthResponse.builder()
                .message("Login successful")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
