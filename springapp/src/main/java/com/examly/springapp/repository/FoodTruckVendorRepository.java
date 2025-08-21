package com.examly.springapp.repository;

import com.examly.springapp.model.FoodTruckVendor;
import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface FoodTruckVendorRepository extends JpaRepository<FoodTruckVendor, Long> {
    Optional<FoodTruckVendor> findByUser(User user);
    List<FoodTruckVendor> findByOperatingRegion(String region);
    List<FoodTruckVendor> findByCuisineSpecialtiesContaining(String cuisine);
}