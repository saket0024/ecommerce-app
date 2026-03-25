package com.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountedPrice;
    private Integer discountPercent;
    private Integer stockQuantity;
    private String sku;
    private String brand;
    private BigDecimal rating;
    private Integer reviewCount;
    private CategoryResponse category;
    private List<String> imageUrls;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
