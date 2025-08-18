package com.examly.springapp.controller;

import com.examly.springapp.exception.InvalidOperatingRegionException;
import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.service.FoodTruckVendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class FoodTruckVendorController {

    @Autowired
    private FoodTruckVendorService vendorService;

    @PostMapping("/addVendor")
    public ResponseEntity<FoodTruckVendor> addVendor(@RequestBody FoodTruckVendor vendor) {
        try {
            FoodTruckVendor savedVendor = vendorService.addVendor(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVendor);
        } catch (InvalidOperatingRegionException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/getAllVendors")
    public ResponseEntity<List<FoodTruckVendor>> getAllVendors() {
        try {
            List<FoodTruckVendor> vendors = vendorService.getAllVendors();
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @ExceptionHandler(InvalidOperatingRegionException.class)
    public ResponseEntity<String> handleInvalidOperatingRegion(InvalidOperatingRegionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid operating region. Must be either Chennai or Bangalore.");
    }
}