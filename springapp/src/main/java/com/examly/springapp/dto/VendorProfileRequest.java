// VendorProfileRequest.java
package com.examly.springapp.dto;

public class VendorProfileRequest {
    private String name;
    private String cuisineSpecialties;
    private String operatingRegion;
    private String menuHighlights;
    private String phoneNumber;
    private String businessAddress;
    
    public VendorProfileRequest() {}
    
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
    
    public String getBusinessAddress() { return businessAddress; }
    public void setBusinessAddress(String businessAddress) { this.businessAddress = businessAddress; }
}