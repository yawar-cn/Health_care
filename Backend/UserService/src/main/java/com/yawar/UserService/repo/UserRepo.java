package com.yawar.UserService.repo;

import com.yawar.UserService.model.Users;
import com.yawar.UserService.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users ,Long> {
    Optional<Users> findByEmail(String email);
    List<Users> findByRole(Role role);
    List<Users> findByRoleAndSpecializationIgnoreCase(Role role, String specialization);

}
