package com.ecommerce.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 255)
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0) @Max(value = 100)
    private Integer discountPercent = 0;

    @NotNull @Min(0)
    private Integer stockQuantity;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String brand;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private List<String> imageUrls;
}
