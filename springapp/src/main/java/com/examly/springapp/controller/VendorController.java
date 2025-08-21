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
@CrossOrigin(origins = "http://localhost:3000")
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
            User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
            
            FoodTruckVendor vendor = vendorService.createOrUpdateVendorProfile(
                user,
                profileRequest.getName(),
                profileRequest.getCuisineSpecialties(),
                profileRequest.getOperatingRegion(),
                profileRequest.getMenuHighlights(),
                profileRequest.getPhoneNumber(),
                profileRequest.getBusinessAddress()
            );
            
            return ResponseEntity.ok(vendor);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        Optional<FoodTruckVendor> vendor = vendorService.getVendorByUser(user);
        if (vendor.isPresent()) {
            return ResponseEntity.ok(vendor.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Profile not found");
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/application")
    public ResponseEntity<?> createApplication(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
            
            Optional<FoodTruckVendor> vendorOpt = vendorService.getVendorByUser(user);
            if (vendorOpt.isPresent() && vendorOpt.get().isProfileComplete()) {
                VendorApplication application = vendorService.createApplication(vendorOpt.get());
                return ResponseEntity.ok(application);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Please complete your profile first");
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
            VendorApplication application = vendorService.submitApplication(id);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        Optional<FoodTruckVendor> vendor = vendorService.getVendorByUser(user);
        if (vendor.isPresent()) {
            List<VendorApplication> applications = vendorService.getVendorApplications(vendor.get());
            return ResponseEntity.ok(applications);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        Map<String, Object> dashboardData = new HashMap<>();
        Optional<FoodTruckVendor> vendor = vendorService.getVendorByUser(user);
        
        if (vendor.isPresent()) {
            dashboardData.put("profile", vendor.get());
            List<VendorApplication> applications = vendorService.getVendorApplications(vendor.get());
            dashboardData.put("applications", applications);
            dashboardData.put("applicationCount", applications.size());
        } else {
            dashboardData.put("profileComplete", false);
        }
        
        return ResponseEntity.ok(dashboardData);
    }
}