
package com.examly.springapp.controller;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.VendorApplication;
import com.examly.springapp.repository.VendorApplicationRepository;
import com.examly.springapp.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private VendorService vendorService;
    
    @Autowired
    private VendorApplicationRepository applicationRepository;
    
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
        
        dashboard.put("totalVendors", allVendors.size());
        dashboard.put("totalApplications", allApplications.size());
        
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
}