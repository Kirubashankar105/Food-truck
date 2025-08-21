package com.examly.springapp.service;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.repository.FoodTruckVendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodTruckVendorService {

    @Autowired
    private FoodTruckVendorRepository vendorRepository;

    public FoodTruckVendor addVendor(FoodTruckVendor vendor) throws Exception {
        // Validate operating region
        if (vendor.getOperatingRegion() == null ||
            (!vendor.getOperatingRegion().equals("Chennai") && 
             !vendor.getOperatingRegion().equals("Bangalore"))) {
            throw new Exception("Invalid operating region. Must be either Chennai or Bangalore.");
        }
        
        return vendorRepository.save(vendor);
    }
    
    public List<FoodTruckVendor> getAllVendors() {
        return vendorRepository.findAll();
    }
}