
package com.ridelux.service;

import com.ridelux.dto.LoginRequestDTO;
import com.ridelux.dto.LoginResponseDTO;
import com.ridelux.entity.DriverApprovalStatus;
import com.ridelux.entity.Role;
import com.ridelux.entity.User;
import com.ridelux.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (user.getRole() == null) {
            user.setRole(Role.PASSENGER);
        }

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException(
                    "Admin registration is not allowed");
        }

        if (user.getRole() == Role.DRIVER) {
            user.setDriverApprovalStatus(
                    DriverApprovalStatus.PENDING);
        } else {
            user.setDriverApprovalStatus(
                    DriverApprovalStatus.NOT_APPLICABLE);
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(
                request.getEmail().trim())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"));

        String storedPassword = user.getPassword();
        String enteredPassword = request.getPassword();

        boolean passwordMatches = false;

        if (storedPassword != null
                && storedPassword.startsWith("$2")) {

            passwordMatches = passwordEncoder.matches(
                    enteredPassword, storedPassword);

        } else if (storedPassword != null) {

            // Migrate old plain-text passwords to BCrypt.
            passwordMatches = enteredPassword.equals(storedPassword);

            if (passwordMatches) {
                user.setPassword(
                        passwordEncoder.encode(enteredPassword));
                userRepository.save(user);
            }
        }

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Invalid email or password");
        }

        return new LoginResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole());
    }

    @Override
    public List<User> getPendingDrivers() {
        return userRepository.findByRoleAndDriverApprovalStatus(
                Role.DRIVER,
                DriverApprovalStatus.PENDING);
    }

    @Override
    public User updateDriverApproval(
            Long userId,
            DriverApprovalStatus status) {

        if (status != DriverApprovalStatus.APPROVED
                && status != DriverApprovalStatus.REJECTED) {
            throw new IllegalArgumentException(
                    "Status must be APPROVED or REJECTED");
        }

        User user = getUserById(userId);

        if (user.getRole() != Role.DRIVER) {
            throw new IllegalArgumentException(
                    "The selected user is not a driver");
        }

        user.setDriverApprovalStatus(status);

        return userRepository.save(user);
    }

    @Override
    public long getTotalUsers() {
        return userRepository.count();
    }

    @Override
    public long getTotalPassengers() {
        return userRepository.countByRole(Role.PASSENGER);
    }

    @Override
    public long getTotalDrivers() {
        return userRepository.countByRole(Role.DRIVER);
    }

    @Override
    public long getPendingDriverCount() {
        return userRepository.countByRoleAndDriverApprovalStatus(
                Role.DRIVER,
                DriverApprovalStatus.PENDING);
    }
}
