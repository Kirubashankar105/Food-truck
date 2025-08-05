package repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import model.FoodTruckVendor;

@Repository
public interface FoodTruckVendorRepo extends JpaRepository<FoodTruckVendor, Integer> {
}