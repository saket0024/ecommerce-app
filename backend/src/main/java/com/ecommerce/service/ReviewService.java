package com.ecommerce.service;

import com.ecommerce.dto.request.ReviewRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ReviewResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Product;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public PageResponse<ReviewResponse> getProductReviews(Long productId, int page, int size, String sortBy) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }
        Sort sort = Sort.by(sortBy.equals("rating") ? "rating" : "createdAt").descending();
        Page<Review> reviews = reviewRepository.findByProductId(productId, PageRequest.of(page, size, sort));

        return PageResponse.<ReviewResponse>builder()
            .content(reviews.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
            .page(reviews.getNumber()).size(reviews.getSize())
            .totalElements(reviews.getTotalElements())
            .totalPages(reviews.getTotalPages())
            .first(reviews.isFirst()).last(reviews.isLast())
            .build();
    }

    @Transactional
    public ReviewResponse createReview(String email, Long productId, ReviewRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findByIdAndIsActiveTrue(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = Review.builder()
            .user(user)
            .product(product)
            .rating(request.getRating())
            .title(request.getTitle())
            .body(request.getBody())
            .build();

        Review saved = reviewRepository.save(review);
        updateProductRating(product);
        return toResponse(saved);
    }

    @Transactional
    public ReviewResponse updateReview(String email, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        if (!review.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setBody(request.getBody());

        Review saved = reviewRepository.save(review);
        updateProductRating(review.getProduct());
        return toResponse(saved);
    }

    @Transactional
    public void deleteReview(String email, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!review.getUser().getId().equals(user.getId()) &&
            user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);
        updateProductRating(product);
    }

    private void updateProductRating(Product product) {
        Double avg = reviewRepository.getAverageRatingForProduct(product.getId());
        Long count = reviewRepository.countByProductId(product.getId());
        product.setRating(avg == null ? BigDecimal.ZERO :
            BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        product.setReviewCount(count == null ? 0 : count.intValue());
        productRepository.save(product);
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
            .id(review.getId())
            .userId(review.getUser().getId())
            .userName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
            .rating(review.getRating())
            .title(review.getTitle())
            .body(review.getBody())
            .verified(review.getVerified())
            .createdAt(review.getCreatedAt())
            .build();
    }
}
