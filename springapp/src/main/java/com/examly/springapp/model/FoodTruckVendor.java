package com.examly.springapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "food_truck_vendors")
public class FoodTruckVendor {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
   
    @Column(nullable = false)
    private String name;
   
    @Column(nullable = false)
    private String cuisineSpecialties;
   
    @Column(nullable = false)
    private String operatingRegion;
   
    @Column(nullable = false)
    private String menuHighlights;
   
    @Column(nullable = false)
    private String phoneNumber;
   
    // Default constructor
    public FoodTruckVendor() {}
   
    // Constructor with parameters
    public FoodTruckVendor(String name, String cuisineSpecialties, String operatingRegion,
                          String menuHighlights, String phoneNumber) {
        this.name = name;
        this.cuisineSpecialties = cuisineSpecialties;
        this.operatingRegion = operatingRegion;
        this.menuHighlights = menuHighlights;
        this.phoneNumber = phoneNumber;
    }
   
    // Getters and Setters
    public int getId() {
        return id;
    }
   
    public void setId(int id) {
        this.id = id;
    }
   
    public String getName() {
        return name;
    }
   
    public void setName(String name) {
        this.name = name;
    }
   
    public String getCuisineSpecialties() {
        return cuisineSpecialties;
    }
   
    public void setCuisineSpecialties(String cuisineSpecialties) {
        this.cuisineSpecialties = cuisineSpecialties;
    }
   
    public String getOperatingRegion() {
        return operatingRegion;
    }
   
    public void setOperatingRegion(String operatingRegion) {
        this.operatingRegion = operatingRegion;
    }
   
    public String getMenuHighlights() {
        return menuHighlights;
    }
   
    public void setMenuHighlights(String menuHighlights) {
        this.menuHighlights = menuHighlights;
    }
   
    public String getPhoneNumber() {
        return phoneNumber;
    }
   
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public String toString() {
        return "FoodTruckVendor{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", cuisineSpecialties='" + cuisineSpecialties + '\'' +
                ", operatingRegion='" + operatingRegion + '\'' +
                ", menuHighlights='" + menuHighlights + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}