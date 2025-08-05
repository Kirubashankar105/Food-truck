package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import model.FoodTruckVendor;
import service.FoodTruckVendorService;

@RestController
@RequestMapping("/api")
public class FoodTruckVendorController {

    @Autowired
    private FoodTruckVendorService vendorService;

    @PostMapping("/addVendor")
    public FoodTruckVendor addVendor(@RequestBody FoodTruckVendor vendor) {
        return vendorService.addVendor(vendor);
    }

    @GetMapping("/getAllVendors")
    public ResponseEntity<?> getAllVendors() {
        return (ResponseEntity<?>) vendorService.getAllVendors();
    }
}