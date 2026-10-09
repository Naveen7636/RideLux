
package com.ridelux.repository;

import com.ridelux.entity.DriverApprovalStatus;
import com.ridelux.entity.Role;
import com.ridelux.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Find drivers by their approval status.
    List<User> findByRoleAndDriverApprovalStatus(
            Role role,
            DriverApprovalStatus driverApprovalStatus
    );

    // Count users by role.
    long countByRole(Role role);

    // Count drivers by approval status.
    long countByRoleAndDriverApprovalStatus(
            Role role,
            DriverApprovalStatus driverApprovalStatus
    );
}
