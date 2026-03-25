package com.ecommerce.util;

import com.ecommerce.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecification {

    public static Specification<Product> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? null :
            cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasMinPrice(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null ? null :
            cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Product> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null ? null :
            cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Product> hasBrand(String brand) {
        return (root, query, cb) -> brand == null ? null :
            cb.equal(cb.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<Product> containsSearchTerm(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) return null;
            String pattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("brand")), pattern)
            );
        };
    }
}
