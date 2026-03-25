package com.ecommerce.service;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.dto.response.CategoryResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable("categories")
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByParentCategoryIsNull().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        return toResponse(categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id)));
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug already exists: " + request.getSlug());
        }
        Category category = buildCategory(request, null);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        existing.setName(request.getName());
        existing.setSlug(request.getSlug());
        existing.setImageUrl(request.getImageUrl());
        if (request.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(request.getParentCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent Category", request.getParentCategoryId()));
            existing.setParentCategory(parent);
        }
        return toResponse(categoryRepository.save(existing));
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", id);
        }
        categoryRepository.deleteById(id);
    }

    private Category buildCategory(CategoryRequest request, Category parent) {
        Category category = Category.builder()
            .name(request.getName())
            .slug(request.getSlug())
            .imageUrl(request.getImageUrl())
            .parentCategory(parent)
            .build();

        if (request.getParentCategoryId() != null && parent == null) {
            Category parentCat = categoryRepository.findById(request.getParentCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent Category", request.getParentCategoryId()));
            category.setParentCategory(parentCat);
        }
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        List<CategoryResponse> subs = category.getSubCategories() == null ? List.of() :
            category.getSubCategories().stream().map(sub ->
                CategoryResponse.builder()
                    .id(sub.getId()).name(sub.getName())
                    .slug(sub.getSlug()).imageUrl(sub.getImageUrl())
                    .build()
            ).collect(Collectors.toList());

        return CategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .imageUrl(category.getImageUrl())
            .parentCategoryId(category.getParentCategory() == null ? null : category.getParentCategory().getId())
            .subCategories(subs)
            .build();
    }
}
