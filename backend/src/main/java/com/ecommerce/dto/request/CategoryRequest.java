package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank private String name;
    @NotBlank private String slug;
    private String imageUrl;
    private Long parentCategoryId;
}
