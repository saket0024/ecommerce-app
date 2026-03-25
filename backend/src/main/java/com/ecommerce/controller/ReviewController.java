package com.ecommerce.controller;

import com.ecommerce.dto.request.ReviewRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ReviewResponse;
import com.ecommerce.service.ReviewService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/products/{productId}")
    public ResponseEntity<PageResponse<ReviewResponse>> getProductReviews(
        @PathVariable Long productId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, page, size, sortBy));
    }

    @PostMapping("/products/{productId}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ReviewResponse> createReview(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long productId,
        @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(201).body(
            reviewService.createReview(userDetails.getUsername(), productId, request));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ReviewResponse> updateReview(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id,
        @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteReview(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long id) {
        reviewService.deleteReview(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
