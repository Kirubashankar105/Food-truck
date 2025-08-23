package com.examly.springapp.controller;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VendorApplication;
import com.examly.springapp.model.VendorApplication.ApplicationStatus;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.VendorApplicationRepository;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {
    
    @Autowired
    private VendorService vendorService;
    
    @Autowired
    private VendorApplicationRepository applicationRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    // User verification endpoints
    @GetMapping("/pending-users")
    public ResponseEntity<?> getPendingUsers() {
        List<User> pendingUsers = userRepository.findAll().stream()
            .filter(user -> !user.isVerified() && !user.isEnabled())
            .collect(Collectors.toList());
            
        List<Map<String, Object>> userList = pendingUsers.stream()
            .map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("email", user.getEmail());
                userMap.put("createdAt", user.getCreatedAt());
                userMap.put("roles", user.getRoles());
                return userMap;
            })
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(userList);
    }
    
    @PostMapping("/verify-user/{userId}")
    public ResponseEntity<?> verifyUser(@PathVariable Long userId, @RequestParam boolean approve) {
        try {
            boolean result = userService.verifyUserByAdmin(userId, approve);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", result);
            response.put("message", approve ? "User approved successfully" : "User rejected");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Existing vendor and application endpoints...
    @GetMapping("/vendors")
    public ResponseEntity<List<FoodTruckVendor>> getAllVendors() {
        List<FoodTruckVendor> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }
    
    @GetMapping("/vendors/region/{region}")
    public ResponseEntity<List<FoodTruckVendor>> getVendorsByRegion(@PathVariable String region) {
        List<FoodTruckVendor> vendors = vendorService.getVendorsByRegion(region);
        return ResponseEntity.ok(vendors);
    }
    
    @GetMapping("/applications")
    public ResponseEntity<List<VendorApplication>> getAllApplications() {
        List<VendorApplication> applications = applicationRepository.findAll();
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/applications/status/{status}")
    public ResponseEntity<List<VendorApplication>> getApplicationsByStatus(@PathVariable String status) {
        VendorApplication.ApplicationStatus applicationStatus = VendorApplication.ApplicationStatus.valueOf(status.toUpperCase());
        List<VendorApplication> applications = applicationRepository.findByStatus(applicationStatus);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<FoodTruckVendor> allVendors = vendorService.getAllVendors();
        List<VendorApplication> allApplications = applicationRepository.findAll();
        
        // Count pending user verifications
        long pendingUsersCount = userRepository.findAll().stream()
            .filter(user -> !user.isVerified() && !user.isEnabled())
            .count();
        
        dashboard.put("totalVendors", allVendors.size());
        dashboard.put("totalApplications", allApplications.size());
        dashboard.put("pendingUserVerifications", pendingUsersCount);
        
        long pendingCount = allApplications.stream()
            .filter(app -> app.getStatus() == VendorApplication.ApplicationStatus.SUBMITTED)
            .count();
        long approvedCount = allApplications.stream()
            .filter(app -> app.getStatus() == VendorApplication.ApplicationStatus.APPROVED)
            .count();
        long rejectedCount = allApplications.stream()
            .filter(app -> app.getStatus() == VendorApplication.ApplicationStatus.REJECTED)
            .count();
        
        dashboard.put("pendingApplications", pendingCount);
        dashboard.put("approvedApplications", approvedCount);
        dashboard.put("rejectedApplications", rejectedCount);
        
        return ResponseEntity.ok(dashboard);
    }

    // New endpoint to update application status
    @PostMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        String comments = request.get("comments");

        Optional<VendorApplication> optApp = applicationRepository.findById(id);
        if (!optApp.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Application not found");
            return ResponseEntity.notFound().build();
        }

        VendorApplication app = optApp.get();
        try {
            ApplicationStatus newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase());
            app.setStatus(newStatus);
            app.setComments(comments);
            app.setReviewedAt(LocalDateTime.now());
            app.setUpdatedAt(LocalDateTime.now());
            applicationRepository.save(app);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application status updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid status");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}