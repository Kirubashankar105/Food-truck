package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.repository.FoodTruckVendorRepo;
import com.examly.springapp.exception.InvalidOperatingRegionException;

@Service
public class FoodTruckVendorService {

    @Autowired
    private FoodTruckVendorRepo vendorRepo;

    public FoodTruckVendor addVendor(FoodTruckVendor vendor) {
        String region = vendor.getOperatingRegion();
        if (!region.equalsIgnoreCase("Chennai") && !region.equalsIgnoreCase("Bangalore")) {
            throw new InvalidOperatingRegionException("Invalid operating region. Must be either Chennai or Bangalore.");
        }
        return vendorRepo.save(vendor);
    }

    public List<FoodTruckVendor> getAllVendors() {
        return vendorRepo.findAll();
    }
}
