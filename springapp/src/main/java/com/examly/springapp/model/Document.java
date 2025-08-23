package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "application_id", referencedColumnName = "id")
    @JsonIgnore // Prevent circular reference
    private VendorApplication application;
    
    @Enumerated(EnumType.STRING)
    private DocumentType type;
    
    private String fileName;
    private String filePath;
    private String originalFileName;
    private long fileSize;
    private String mimeType;
    private LocalDateTime uploadedAt = LocalDateTime.now();
    
    // Auto-set uploadedAt on creation
    @PrePersist
    public void prePersist() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Document() {}
    
    public Document(VendorApplication application, DocumentType type, String fileName, String filePath) {
        this.application = application;
        this.type = type;
        this.fileName = fileName;
        this.filePath = filePath;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public VendorApplication getApplication() { return application; }
    public void setApplication(VendorApplication application) { this.application = application; }
    
    public DocumentType getType() { return type; }
    public void setType(DocumentType type) { this.type = type; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    
    // Document type enum
    public enum DocumentType {
        BUSINESS_LICENSE,
        FOOD_SAFETY_CERTIFICATION,
        VEHICLE_REGISTRATION,
        INSURANCE_PAPERS,
        MENU_DOCUMENT,
        OTHER
    }
}