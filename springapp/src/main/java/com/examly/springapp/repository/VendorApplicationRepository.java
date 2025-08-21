package com.examly.springapp.repository;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.User;
import com.examly.springapp.model.VendorApplication;
import com.examly.springapp.model.VendorApplication.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorApplicationRepository extends JpaRepository<VendorApplication, Long> {
    List<VendorApplication> findByVendor(FoodTruckVendor vendor);
    List<VendorApplication> findByAssignedReviewer(User reviewer);
    List<VendorApplication> findByAssignedInspector(User inspector);
    List<VendorApplication> findByStatus(ApplicationStatus status);
    Optional<VendorApplication> findByVendorAndStatus(FoodTruckVendor vendor, ApplicationStatus status);
}