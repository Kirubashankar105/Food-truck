package com.examly.springapp.repository;

import com.examly.springapp.model.FoodTruckVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodTruckVendorRepo extends JpaRepository<FoodTruckVendor, Integer> {
}