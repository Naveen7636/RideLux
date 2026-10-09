
package com.ridelux.service;

import com.ridelux.dto.LoginRequestDTO;
import com.ridelux.dto.LoginResponseDTO;
import com.ridelux.entity.DriverApprovalStatus;
import com.ridelux.entity.User;

import java.util.List;

public interface UserService {

    User registerUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    LoginResponseDTO login(LoginRequestDTO request);

    // Admin: view drivers waiting for approval.
    List<User> getPendingDrivers();

    // Admin: approve or reject a driver.
    User updateDriverApproval(
            Long userId,
            DriverApprovalStatus status
    );

    // Admin dashboard statistics.
    long getTotalUsers();

    long getTotalPassengers();

    long getTotalDrivers();

    long getPendingDriverCount();
}
