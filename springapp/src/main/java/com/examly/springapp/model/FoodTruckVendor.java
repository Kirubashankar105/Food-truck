package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FoodTruckVendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String cuisineSpecialties;
    private String operatingRegion;
    private String menuHighlights;
    private String phoneNumber;

    public FoodTruckVendor() {}

    public FoodTruckVendor(String name, String cuisineSpecialties, String operatingRegion,
                           String menuHighlights, String phoneNumber) {
        this.name = name;
        this.cuisineSpecialties = cuisineSpecialties;
        this.operatingRegion = operatingRegion;
        this.menuHighlights = menuHighlights;
        this.phoneNumber = phoneNumber;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCuisineSpecialties() { return cuisineSpecialties; }
    public void setCuisineSpecialties(String cuisineSpecialties) { this.cuisineSpecialties = cuisineSpecialties; }

    public String getOperatingRegion() { return operatingRegion; }
    public void setOperatingRegion(String operatingRegion) { this.operatingRegion = operatingRegion; }

    public String getMenuHighlights() { return menuHighlights; }
    public void setMenuHighlights(String menuHighlights) { this.menuHighlights = menuHighlights; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
