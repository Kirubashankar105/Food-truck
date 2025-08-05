package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.service.FoodTruckVendorService;
import com.examly.springapp.exception.InvalidOperatingRegionException;

@RestController
@CrossOrigin
public class FoodTruckVendorController {

    @Autowired
    private FoodTruckVendorService vendorService;

    @PostMapping("/addVendor")
    public ResponseEntity<FoodTruckVendor> addVendor(@RequestBody FoodTruckVendor vendor) {
        FoodTruckVendor savedVendor = vendorService.addVendor(vendor);
        return ResponseEntity.status(201).body(savedVendor);
    }

    @GetMapping("/getAllVendors")
    public ResponseEntity<List<FoodTruckVendor>> getAllVendors() {
        List<FoodTruckVendor> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }

    @ExceptionHandler(InvalidOperatingRegionException.class)
    public ResponseEntity<String> handleInvalidRegion(InvalidOperatingRegionException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
