package com.examly.springapp.controller;

import com.examly.springapp.dto.VendorProfileRequest;
import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VendorApplication;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendor")
@PreAuthorize("hasRole('VENDOR')")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VendorController {
    
    @Autowired
    private VendorService vendorService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/profile")
    public ResponseEntity<?> createOrUpdateProfile(@RequestBody VendorProfileRequest profileRequest, 
                                                   Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            FoodTruckVendor vendor = vendorService.createOrUpdateVendorProfile(
                user,
                profileRequest.getName(),
                profileRequest.getCuisineSpecialties(),
                profileRequest.getOperatingRegion(),
                profileRequest.getMenuHighlights(),
                profileRequest.getPhoneNumber(),
                profileRequest.getBusinessAddress()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("vendor", vendor);
            response.put("message", "Profile updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Optional<FoodTruckVendor> vendor = vendorService.getVendorByUser(user);
            if (vendor.isPresent()) {
                return ResponseEntity.ok(vendor.get());
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Profile not found. Please create your profile first.");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/application")
    public ResponseEntity<?> createApplication(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Optional<FoodTruckVendor> vendorOpt = vendorService.getVendorByUser(user);
            if (vendorOpt.isPresent()) {
                FoodTruckVendor vendor = vendorOpt.get();
                if (vendor.isProfileComplete()) {
                    // Check if there's already a pending/submitted application
                    List<VendorApplication> existingApps = vendorService.getVendorApplications(vendor);
                    boolean hasActiveApplication = existingApps.stream()
                        .anyMatch(app -> app.getStatus() == VendorApplication.ApplicationStatus.DRAFT ||
                                        app.getStatus() == VendorApplication.ApplicationStatus.SUBMITTED ||
                                        app.getStatus() == VendorApplication.ApplicationStatus.UNDER_REVIEW);
                    
                    if (hasActiveApplication) {
                        Map<String, String> error = new HashMap<>();
                        error.put("error", "You already have an active application in progress");
                        return ResponseEntity.badRequest().body(error);
                    }
                    
                    VendorApplication application = vendorService.createApplication(vendor);
                    return ResponseEntity.ok(application);
                } else {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Please complete your profile first");
                    return ResponseEntity.badRequest().body(error);
                }
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Vendor profile not found. Please create your profile first.");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/application/{id}/submit")
    public ResponseEntity<?> submitApplication(@PathVariable Long id, Authentication authentication) {
        try {
            // Verify the application belongs to the authenticated user
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Optional<FoodTruckVendor> vendorOpt = vendorService.getVendorByUser(user);
            if (vendorOpt.isPresent()) {
                VendorApplication application = vendorService.submitApplication(id);
                // Additional verification that this application belongs to the user
                if (!application.getVendor().getUser().getId().equals(user.getId())) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Unauthorized access to application");
                    return ResponseEntity.badRequest().body(error);
                }
                return ResponseEntity.ok(application);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Vendor not found");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Optional<FoodTruckVendor> vendor = vendorService.getVendorByUser(user);
            if (vendor.isPresent()) {
                List<VendorApplication> applications = vendorService.getVendorApplications(vendor.get());
                return ResponseEntity.ok(applications);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No vendor profile found");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Map<String, Object> dashboardData = vendorService.getDashboardData(user);
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}