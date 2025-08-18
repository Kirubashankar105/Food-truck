package com.examly.springapp.service;

import com.examly.springapp.exception.InvalidOperatingRegionException;
import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.repository.FoodTruckVendorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodTruckVendorService {

    @Autowired
    private FoodTruckVendorRepo vendorRepository;

    public FoodTruckVendor addVendor(FoodTruckVendor vendor) {
        // Validate operating region - only Chennai and Bangalore allowed
        if (vendor.getOperatingRegion() == null ||
            (!vendor.getOperatingRegion().equals("Chennai") && !vendor.getOperatingRegion().equals("Bangalore"))) {
            throw new InvalidOperatingRegionException("Invalid operating region. Must be either Chennai or Bangalore.");
        }
       
        return vendorRepository.save(vendor);
    }

    public List<FoodTruckVendor> getAllVendors() {
        return vendorRepository.findAll();
    }
}