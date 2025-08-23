package com.examly.springapp.configuration;

import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.RoleRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create roles if they don't exist
        Role adminRole = null;
        if (roleRepository.findByName(Role.RoleName.ROLE_ADMIN).isEmpty()) {
            adminRole = roleRepository.save(new Role(Role.RoleName.ROLE_ADMIN));
        } else {
            adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN).get();
        }
        
        Role vendorRole = null;
        if (roleRepository.findByName(Role.RoleName.ROLE_VENDOR).isEmpty()) {
            vendorRole = roleRepository.save(new Role(Role.RoleName.ROLE_VENDOR));
        } else {
            vendorRole = roleRepository.findByName(Role.RoleName.ROLE_VENDOR).get();
        }
        
        Role userRole = null;
        if (roleRepository.findByName(Role.RoleName.ROLE_USER).isEmpty()) {
            userRole = roleRepository.save(new Role(Role.RoleName.ROLE_USER));
        } else {
            userRole = roleRepository.findByName(Role.RoleName.ROLE_USER).get();
        }
        
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@foodtruck.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEnabled(true);
            admin.setVerified(true);
            
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            admin.setRoles(adminRoles);
            
            userRepository.save(admin);
            
            System.out.println("===========================================");
            System.out.println("DEFAULT ADMIN USER CREATED:");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("===========================================");
        }
    }
}