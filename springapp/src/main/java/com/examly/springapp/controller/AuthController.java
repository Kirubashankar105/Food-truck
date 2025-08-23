 package com.examly.springapp.controller;

import com.examly.springapp.dto.LoginRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.dto.UserDTO;
import com.examly.springapp.model.User;
import com.examly.springapp.service.JwtService;
import com.examly.springapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for user: {}", loginRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Fetch full User entity
            User user = userService.findByUsername(userDetails.getUsername());
            if (user == null) {
                logger.warn("User not found after authentication: {}", userDetails.getUsername());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found");
                errorResponse.put("status", "USER_NOT_FOUND");
                return ResponseEntity.status(404).body(errorResponse);
            }

            if (!user.isEnabled() || !user.isVerified()) {
                logger.info("User pending verification: {}", user.getUsername());
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Account is not verified yet. Please wait for admin approval.");
                errorResponse.put("status", "PENDING_VERIFICATION");
                return ResponseEntity.status(403).body(errorResponse);
            }

            String token = jwtService.generateToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", new UserDTO(user)); // ✅ safe user response
            response.put("status", "SUCCESS");

            logger.info("Successful login for user: {}", user.getUsername());
            return ResponseEntity.ok(response);

        } catch (DisabledException e) {
            logger.warn("Disabled account attempt: {}", loginRequest.getUsername());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Account is disabled. Please contact admin.");
            errorResponse.put("status", "ACCOUNT_DISABLED");
            return ResponseEntity.status(403).body(errorResponse);
        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for: {}", loginRequest.getUsername());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid username or password");
            errorResponse.put("status", "INVALID_CREDENTIALS");
            return ResponseEntity.status(401).body(errorResponse);
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for {}: {}", loginRequest.getUsername(), e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Authentication failed: " + e.getMessage());
            errorResponse.put("status", "AUTH_FAILED");
            return ResponseEntity.status(401).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error during login for {}: {}", loginRequest.getUsername(), e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            errorResponse.put("status", "SERVER_ERROR");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createVendorUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully. Please wait for admin verification.");
            response.put("user", new UserDTO(user)); // ✅ return safe DTO
            response.put("status", "PENDING_VERIFICATION");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "REGISTRATION_FAILED");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoint is working!");
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByUsername(userDetails.getUsername());

        return ResponseEntity.ok(new UserDTO(user)); // ✅ safe user response
    }
}