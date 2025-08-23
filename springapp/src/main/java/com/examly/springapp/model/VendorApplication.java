package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "vendor_applications")
public class VendorApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vendor_id", referencedColumnName = "id")
    private FoodTruckVendor vendor;
    
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.DRAFT;
    
    @ManyToOne
    @JoinColumn(name = "assigned_reviewer_id")
    @JsonIgnore // Prevent potential circular reference
    private User assignedReviewer;
    
    @ManyToOne
    @JoinColumn(name = "assigned_inspector_id")
    @JsonIgnore // Prevent potential circular reference
    private User assignedInspector;
    
    @Column(length = 1000)
    private String comments;
    
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime inspectedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Document> documents;
    
    // Auto-update timestamps
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public VendorApplication() {}
    
    public VendorApplication(FoodTruckVendor vendor) {
        this.vendor = vendor;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public FoodTruckVendor getVendor() { return vendor; }
    public void setVendor(FoodTruckVendor vendor) { this.vendor = vendor; }
    
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    
    public User getAssignedReviewer() { return assignedReviewer; }
    public void setAssignedReviewer(User assignedReviewer) { this.assignedReviewer = assignedReviewer; }
    
    public User getAssignedInspector() { return assignedInspector; }
    public void setAssignedInspector(User assignedInspector) { this.assignedInspector = assignedInspector; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    
    public LocalDateTime getInspectedAt() { return inspectedAt; }
    public void setInspectedAt(LocalDateTime inspectedAt) { this.inspectedAt = inspectedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }
    
    // Application status enum
    public enum ApplicationStatus {
        DRAFT, 
        SUBMITTED, 
        UNDER_REVIEW, 
        APPROVED, 
        REJECTED, 
        INSPECTION_SCHEDULED, 
        INSPECTION_COMPLETED, 
        LICENSED
    }
}