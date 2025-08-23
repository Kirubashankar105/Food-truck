package com.examly.springapp.service;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VendorApplication;
import com.examly.springapp.repository.FoodTruckVendorRepository;
import com.examly.springapp.repository.VendorApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Service
public class VendorService {
    
    @Autowired
    private FoodTruckVendorRepository vendorRepository;
    
    @Autowired
    private VendorApplicationRepository applicationRepository;
    
    public FoodTruckVendor createOrUpdateVendorProfile(User user, String name, String cuisineSpecialties,
                                                       String operatingRegion, String menuHighlights, 
                                                       String phoneNumber, String businessAddress) {
        
        Optional<FoodTruckVendor> existingVendor = vendorRepository.findByUser(user);
        FoodTruckVendor vendor;
        
        if (existingVendor.isPresent()) {
            vendor = existingVendor.get();
        } else {
            vendor = new FoodTruckVendor(user, name);
        }
        
        vendor.setName(name);
        vendor.setCuisineSpecialties(cuisineSpecialties);
        vendor.setOperatingRegion(operatingRegion);
        vendor.setMenuHighlights(menuHighlights);
        vendor.setPhoneNumber(phoneNumber);
        vendor.setBusinessAddress(businessAddress);
        vendor.setProfileComplete(true);
        vendor.setUpdatedAt(LocalDateTime.now());
        
        return vendorRepository.save(vendor);
    }
    
    public Optional<FoodTruckVendor> getVendorByUser(User user) {
        return vendorRepository.findByUser(user);
    }
    
    public List<FoodTruckVendor> getAllVendors() {
        return vendorRepository.findAll();
    }
    
    public List<FoodTruckVendor> getVendorsByRegion(String region) {
        return vendorRepository.findByOperatingRegion(region);
    }
    
    public VendorApplication createApplication(FoodTruckVendor vendor) {
        VendorApplication application = new VendorApplication(vendor);
        return applicationRepository.save(application);
    }
    
    public VendorApplication submitApplication(Long applicationId) {
        Optional<VendorApplication> optApplication = applicationRepository.findById(applicationId);
        if (optApplication.isPresent()) {
            VendorApplication application = optApplication.get();
            application.setStatus(VendorApplication.ApplicationStatus.SUBMITTED);
            application.setSubmittedAt(LocalDateTime.now());
            application.setUpdatedAt(LocalDateTime.now());
            return applicationRepository.save(application);
        }
        throw new RuntimeException("Application not found");
    }
    
    public List<VendorApplication> getVendorApplications(FoodTruckVendor vendor) {
        return applicationRepository.findByVendor(vendor);
    }

    public Map<String, Object> getDashboardData(User user) {
        Map<String, Object> dashboardData = new HashMap<>();
        Optional<FoodTruckVendor> vendor = getVendorByUser(user);
        
        if (vendor.isPresent()) {
            dashboardData.put("profile", vendor.get());
            List<VendorApplication> applications = getVendorApplications(vendor.get());
            dashboardData.put("applications", applications);
            dashboardData.put("applicationCount", applications.size());
        } else {
            dashboardData.put("profileComplete", false);
        }
        
        return dashboardData;
    }
}