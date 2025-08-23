package com.examly.springapp.dto;

import java.util.Set;
import java.util.stream.Collectors;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Role;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private boolean enabled;
    private boolean verified;
    private Set<String> roles; // just role names, not full Role objects

    public UserDTO() {}

    // Constructor to build from User entity
    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.enabled = user.isEnabled();
        this.verified = user.isVerified();
        this.roles = user.getRoles()
                         .stream()
                         .map(role -> role.getName().name())
                         .collect(Collectors.toSet());
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
