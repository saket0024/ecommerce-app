package com.ecommerce.service;

import com.ecommerce.dto.request.ReviewRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ReviewResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock ReviewRepository reviewRepository;
    @Mock ProductRepository productRepository;
    @Mock UserRepository userRepository;
    @InjectMocks ReviewService reviewService;

    private User user;
    private Product product;
    private Review review;

    @BeforeEach
    void setup() {
        user = User.builder().id(1L).email("test@test.com").firstName("Test").lastName("User")
            .role(User.Role.CUSTOMER).build();
        product = Product.builder().id(1L).name("Test Product")
            .price(new BigDecimal("50")).images(new ArrayList<>()).isActive(true)
            .rating(BigDecimal.ZERO).reviewCount(0).build();
        review = Review.builder().id(1L).user(user).product(product)
            .rating(5).title("Great!").body("Loved it").verified(true).build();
    }

    @Test
    void getProductReviews_returnsPage() {
        when(productRepository.existsById(1L)).thenReturn(true);
        when(reviewRepository.findByProductId(eq(1L), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(review)));

        PageResponse<ReviewResponse> result = reviewService.getProductReviews(1L, 0, 10, "createdAt");

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getRating()).isEqualTo(5);
    }

    @Test
    void createReview_success() {
        ReviewRequest request = new ReviewRequest();
        request.setRating(4);
        request.setTitle("Good product");
        request.setBody("Works well for the price");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));
        when(reviewRepository.existsByUserIdAndProductId(1L, 1L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewRepository.getAverageRatingForProduct(1L)).thenReturn(4.0);
        when(reviewRepository.countByProductId(1L)).thenReturn(1L);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ReviewResponse response = reviewService.createReview("test@test.com", 1L, request);

        assertThat(response.getRating()).isEqualTo(5);
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void createReview_alreadyReviewed_throwsBadRequest() {
        ReviewRequest request = new ReviewRequest();
        request.setRating(3);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));
        when(reviewRepository.existsByUserIdAndProductId(1L, 1L)).thenReturn(true);

        assertThatThrownBy(() -> reviewService.createReview("test@test.com", 1L, request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("already reviewed");
    }

    @Test
    void updateReview_ownReview_success() {
        ReviewRequest request = new ReviewRequest();
        request.setRating(3);
        request.setTitle("Changed mind");
        request.setBody("Not as good as I thought");

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewRepository.getAverageRatingForProduct(anyLong())).thenReturn(3.0);
        when(reviewRepository.countByProductId(anyLong())).thenReturn(1L);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ReviewResponse response = reviewService.updateReview("test@test.com", 1L, request);

        assertThat(response).isNotNull();
    }

    @Test
    void updateReview_otherUserReview_throwsBadRequest() {
        ReviewRequest request = new ReviewRequest();
        request.setRating(2);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        assertThatThrownBy(() -> reviewService.updateReview("other@test.com", 1L, request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("only update your own");
    }

    @Test
    void deleteReview_success() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(reviewRepository.getAverageRatingForProduct(anyLong())).thenReturn(null);
        when(reviewRepository.countByProductId(anyLong())).thenReturn(0L);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        assertThatCode(() -> reviewService.deleteReview("test@test.com", 1L))
            .doesNotThrowAnyException();

        verify(reviewRepository).delete(review);
    }
}
