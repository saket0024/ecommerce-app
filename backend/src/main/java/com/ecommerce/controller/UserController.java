package com.ecommerce.controller;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.dto.response.UserResponse;
import com.ecommerce.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            userService.updateProfile(userDetails.getUsername(), body.get("firstName"), body.get("lastName")));
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<List<AddressResponse>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getAddresses(userDetails.getUsername()));
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<AddressResponse> addAddress(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.status(201).body(userService.addAddress(userDetails.getUsername(), request));
    }

    @PutMapping("/me/addresses/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id,
        @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(userService.updateAddress(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/me/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id) {
        userService.deleteAddress(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
