package com.examly.springapp.exception;

public class InvalidOperatingRegionException extends RuntimeException {
    public InvalidOperatingRegionException(String message) {
        super(message);
    }
}
