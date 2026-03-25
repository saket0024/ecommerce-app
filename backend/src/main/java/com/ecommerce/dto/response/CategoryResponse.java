package com.ecommerce.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String imageUrl;
    private Long parentCategoryId;
    private List<CategoryResponse> subCategories;
}
