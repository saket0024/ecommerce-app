package com.ecommerce.service;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.ProductImage;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.util.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Cacheable("products")
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProducts(
            int page, int size, String sortBy, String sortDir,
            Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
            String brand, String search) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);

        Specification<Product> spec = Specification
            .where(ProductSpecification.isActive())
            .and(ProductSpecification.hasCategory(categoryId))
            .and(ProductSpecification.hasMinPrice(minPrice))
            .and(ProductSpecification.hasMaxPrice(maxPrice))
            .and(ProductSpecification.hasBrand(brand))
            .and(ProductSpecification.containsSearchTerm(search));

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return toPageResponse(productPage);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return toResponse(product);
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new BadRequestException("SKU already exists: " + request.getSku());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        Product product = Product.builder()
            .name(request.getName())
            .description(request.getDescription())
            .price(request.getPrice())
            .discountPercent(request.getDiscountPercent())
            .stockQuantity(request.getStockQuantity())
            .sku(request.getSku())
            .brand(request.getBrand())
            .category(category)
            .images(new ArrayList<>())
            .build();

        if (request.getImageUrls() != null) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ProductImage.builder()
                    .product(product)
                    .imageUrl(request.getImageUrls().get(i))
                    .sortOrder(i)
                    .isPrimary(i == 0)
                    .build());
            }
            product.setImages(images);
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPercent(request.getDiscountPercent());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setCategory(category);

        if (request.getImageUrls() != null) {
            product.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                product.getImages().add(ProductImage.builder()
                    .product(product)
                    .imageUrl(request.getImageUrls().get(i))
                    .sortOrder(i)
                    .isPrimary(i == 0)
                    .build());
            }
        }

        return toResponse(productRepository.save(product));
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setIsActive(false);
        productRepository.save(product);
    }

    private PageResponse<ProductResponse> toPageResponse(Page<Product> page) {
        return PageResponse.<ProductResponse>builder()
            .content(page.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .first(page.isFirst())
            .last(page.isLast())
            .build();
    }

    public ProductResponse toResponse(Product product) {
        List<String> imageUrls = product.getImages() == null ? List.of() :
            product.getImages().stream()
                .sorted((a, b) -> a.getSortOrder() - b.getSortOrder())
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return ProductResponse.builder()
            .id(product.getId())
            .name(product.getName())
            .description(product.getDescription())
            .price(product.getPrice())
            .discountedPrice(product.getDiscountedPrice())
            .discountPercent(product.getDiscountPercent())
            .stockQuantity(product.getStockQuantity())
            .sku(product.getSku())
            .brand(product.getBrand())
            .rating(product.getRating())
            .reviewCount(product.getReviewCount())
            .category(toCategoryResponse(product.getCategory()))
            .imageUrls(imageUrls)
            .isActive(product.getIsActive())
            .createdAt(product.getCreatedAt())
            .build();
    }

    private com.ecommerce.dto.response.CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return com.ecommerce.dto.response.CategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .slug(category.getSlug())
            .imageUrl(category.getImageUrl())
            .build();
    }
}
