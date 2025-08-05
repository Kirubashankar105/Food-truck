package service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import exception.InvalidOperatingRegionException;
import model.FoodTruckVendor;
import repository.FoodTruckVendorRepo;

import java.util.List;

@Service
public class FoodTruckVendorService {

    @Autowired
    private FoodTruckVendorRepo vendorRepo;

    public FoodTruckVendor addVendor(FoodTruckVendor vendor) {
        // Validate operating region
        String region = (String) vendor.getOperatingRegion();
        if (!region.equalsIgnoreCase("Chennai") && 
            !region.equalsIgnoreCase("Bangalore")) {
            throw new InvalidOperatingRegionException("Invalid operating region. Must be either Chennai or Bangalore.");
        }
        return vendorRepo.save(vendor);
    }

    public List<FoodTruckVendor> getAllVendors() {
        return vendorRepo.findAll();
    }
}