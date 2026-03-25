package com.ecommerce.controller;

import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.security.JwtAuthFilter;
import com.ecommerce.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = ProductController.class,
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthFilter.class))
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean ProductService productService;

    private ProductResponse productResponse;
    private PageResponse<ProductResponse> pageResponse;

    @BeforeEach
    void setup() {
        productResponse = ProductResponse.builder()
            .id(1L).name("Test Product").price(new BigDecimal("99.99"))
            .discountedPrice(new BigDecimal("99.99")).discountPercent(0)
            .stockQuantity(50).sku("TEST-001").brand("TestBrand")
            .rating(BigDecimal.ZERO).reviewCount(0).isActive(true)
            .imageUrls(List.of()).build();

        pageResponse = PageResponse.<ProductResponse>builder()
            .content(List.of(productResponse))
            .page(0).size(20).totalElements(1).totalPages(1)
            .first(true).last(true).build();
    }

    @Test
    void getProducts_returnsOk() throws Exception {
        when(productService.getProducts(anyInt(), anyInt(), anyString(), anyString(),
            any(), any(), any(), any(), any())).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content[0].id").value(1))
            .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void getProductById_found_returnsOk() throws Exception {
        when(productService.getProductById(1L)).thenReturn(productResponse);

        mockMvc.perform(get("/api/v1/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    void searchProducts_returnsOk() throws Exception {
        when(productService.getProducts(anyInt(), anyInt(), anyString(), anyString(),
            any(), any(), any(), any(), eq("test"))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/products/search").param("q", "test"))
            .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_adminRole_returnsCreated() throws Exception {
        String requestBody = """
            {
                "name": "New Product",
                "description": "Desc",
                "price": 49.99,
                "discountPercent": 0,
                "stockQuantity": 100,
                "sku": "NEW-001",
                "brand": "Brand",
                "categoryId": 1
            }
            """;

        when(productService.createProduct(any())).thenReturn(productResponse);

        mockMvc.perform(post("/api/v1/products")
                .contentType("application/json").content(requestBody))
            .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createProduct_customerRole_returnsForbidden() throws Exception {
        mockMvc.perform(post("/api/v1/products")
                .contentType("application/json").content("{}"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_adminRole_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/products/1"))
            .andExpect(status().isNoContent());
    }
}
