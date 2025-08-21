package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_truck_vendors")
public class FoodTruckVendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    
    @Column(nullable = false)
    private String name;
    
    private String cuisineSpecialties;
    private String operatingRegion;
    private String menuHighlights;
    private String phoneNumber;
    private String businessAddress;
    private String licenseNumber;
    private LocalDateTime licenseExpiry;
    private boolean profileComplete = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructors
    public FoodTruckVendor() {}
    
    public FoodTruckVendor(User user, String name) {
        this.user = user;
        this.name = name;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCuisineSpecialties() { return cuisineSpecialties; }
    public void setCuisineSpecialties(String cuisineSpecialties) { this.cuisineSpecialties = cuisineSpecialties; }
    
    public String getOperatingRegion() { return operatingRegion; }
    public void setOperatingRegion(String operatingRegion) { this.operatingRegion = operatingRegion; }
    
    public String getMenuHighlights() { return menuHighlights; }
    public void setMenuHighlights(String menuHighlights) { this.menuHighlights = menuHighlights; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getBusinessAddress() { return businessAddress; }
    public void setBusinessAddress(String businessAddress) { this.businessAddress = businessAddress; }
    
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    
    public LocalDateTime getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(LocalDateTime licenseExpiry) { this.licenseExpiry = licenseExpiry; }
    
    public boolean isProfileComplete() { return profileComplete; }
    public void setProfileComplete(boolean profileComplete) { this.profileComplete = profileComplete; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}