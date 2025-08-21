package com.examly.springapp.repository;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.VendorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByApplication(VendorApplication application);
    List<Document> findByApplicationAndType(VendorApplication application, Document.DocumentType type);
}