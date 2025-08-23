package com.examly.springapp.service;

import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.RoleRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, 
                      RoleRepository roleRepository, 
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found: " + username));
        
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toSet());
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
    }
    
    public User createVendorUser(String username, String email, String password) {
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username cannot be empty!");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty!");
        }
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long!");
        }
        
        // Check for duplicates
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create user with encoded password
        User user = new User(username, email, passwordEncoder.encode(password));
        
        // Assign ROLE_VENDOR
        Set<Role> roles = new HashSet<>();
        Role vendorRole = roleRepository.findByName(Role.RoleName.ROLE_VENDOR)
                .orElseThrow(() -> new RuntimeException("Vendor Role not found."));
        roles.add(vendorRole);
        user.setRoles(roles);
        
        // Set verification token for admin approval
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiry(LocalDateTime.now().plusDays(7)); // 7 days to get verified
        
        // User starts as unverified and disabled - needs admin approval
        user.setVerified(false);
        user.setEnabled(false);
        
        return userRepository.save(user);
    }
    
    public User createAdminUser(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = new User(username, email, passwordEncoder.encode(password));
        
        Set<Role> roles = new HashSet<>();
        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin Role not found."));
        roles.add(adminRole);
        user.setRoles(roles);
        
        // Admins are auto-verified and enabled
        user.setVerified(true);
        user.setEnabled(true);
        
        return userRepository.save(user);
    }
    
    public boolean verifyUserByAdmin(Long userId, boolean approve) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (approve) {
            user.setVerified(true);
            user.setEnabled(true);
            user.setVerificationToken(null);
            user.setTokenExpiry(null);
        } else {
            // Reject user - you might want to delete or mark as rejected
            user.setEnabled(false);
            user.setVerified(false);
        }
        
        userRepository.save(user);
        return true;
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
