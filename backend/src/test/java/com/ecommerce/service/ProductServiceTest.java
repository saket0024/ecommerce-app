package com.ecommerce.service;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock CategoryRepository categoryRepository;
    @InjectMocks ProductService productService;

    private Category category;
    private Product product;

    @BeforeEach
    void setup() {
        category = Category.builder().id(1L).name("Electronics").slug("electronics").build();
        product = Product.builder()
            .id(1L).name("Test Product").description("Description")
            .price(new BigDecimal("99.99")).discountPercent(0).stockQuantity(100)
            .sku("TEST-001").brand("TestBrand").rating(BigDecimal.ZERO).reviewCount(0)
            .category(category).images(new ArrayList<>()).isActive(true)
            .build();
    }

    @Test
    void getProducts_returnsPageResponse() {
        List<Product> products = List.of(product);
        when(productRepository.findAll(any(Specification.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(products));

        PageResponse<ProductResponse> result = productService.getProducts(
            0, 20, "createdAt", "desc", null, null, null, null, null);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Test Product");
        assertThat(result.getPage()).isZero();
        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    void getProductById_found_returnsResponse() {
        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Test Product");
        assertThat(response.getPrice()).isEqualByComparingTo("99.99");
    }

    @Test
    void getProductById_notFound_throwsException() {
        when(productRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(99L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createProduct_success() {
        ProductRequest request = new ProductRequest();
        request.setName("New Product");
        request.setDescription("New Desc");
        request.setPrice(new BigDecimal("49.99"));
        request.setDiscountPercent(0);
        request.setStockQuantity(50);
        request.setSku("NEW-001");
        request.setBrand("NewBrand");
        request.setCategoryId(1L);

        when(productRepository.existsBySku("NEW-001")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(request);

        assertThat(response).isNotNull();
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProduct_duplicateSku_throwsBadRequest() {
        ProductRequest request = new ProductRequest();
        request.setSku("TEST-001");
        request.setCategoryId(1L);
        request.setName("N"); request.setPrice(BigDecimal.ONE); request.setStockQuantity(1);

        when(productRepository.existsBySku("TEST-001")).thenReturn(true);

        assertThatThrownBy(() -> productService.createProduct(request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("SKU already exists");
    }

    @Test
    void updateProduct_success() {
        ProductRequest request = new ProductRequest();
        request.setName("Updated Name");
        request.setDescription("Updated Desc");
        request.setPrice(new BigDecimal("79.99"));
        request.setDiscountPercent(10);
        request.setStockQuantity(80);
        request.setSku("TEST-001");
        request.setBrand("UpdatedBrand");
        request.setCategoryId(1L);

        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.updateProduct(1L, request);

        assertThat(response).isNotNull();
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void deleteProduct_softDeletes() {
        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productService.deleteProduct(1L);

        assertThat(product.getIsActive()).isFalse();
        verify(productRepository).save(product);
    }

    @Test
    void deleteProduct_notFound_throwsException() {
        when(productRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteProduct(99L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getProducts_withFilters_appliesSpecification() {
        when(productRepository.findAll(any(Specification.class), any(Pageable.class)))
            .thenReturn(new PageImpl<>(List.of(product)));

        PageResponse<ProductResponse> result = productService.getProducts(
            0, 10, "price", "asc", 1L,
            new BigDecimal("10"), new BigDecimal("200"), "TestBrand", "test");

        assertThat(result.getContent()).isNotEmpty();
        verify(productRepository).findAll(any(Specification.class), any(Pageable.class));
    }
}
