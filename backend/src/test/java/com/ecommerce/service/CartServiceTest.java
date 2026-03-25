package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock CartRepository cartRepository;
    @Mock CartItemRepository cartItemRepository;
    @Mock ProductRepository productRepository;
    @Mock UserRepository userRepository;
    @InjectMocks CartService cartService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setup() {
        user = User.builder().id(1L).email("test@test.com").firstName("Test").lastName("User").build();
        cart = Cart.builder().id(1L).user(user).cartItems(new ArrayList<>()).build();
        product = Product.builder()
            .id(1L).name("Test Product").price(new BigDecimal("29.99"))
            .discountPercent(0).stockQuantity(50).images(new ArrayList<>())
            .isActive(true).build();
    }

    @Test
    void getCart_existingCart_returnsResponse() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        CartResponse response = cartService.getCart("test@test.com");

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getItems()).isEmpty();
        assertThat(response.getTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void getCart_noExistingCart_createsNew() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartResponse response = cartService.getCart("test@test.com");

        assertThat(response).isNotNull();
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addItem_newItem_success() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(new CartItem());
        when(cartRepository.findById(1L)).thenReturn(Optional.of(cart));

        CartResponse response = cartService.addItem("test@test.com", request);

        assertThat(response).isNotNull();
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void addItem_insufficientStock_throwsBadRequest() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(100);

        product.setStockQuantity(5);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> cartService.addItem("test@test.com", request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Insufficient stock");
    }

    @Test
    void addItem_productNotFound_throwsException() {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(99L);
        request.setQuantity(1);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItem("test@test.com", request))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void removeItem_success() {
        CartItem cartItem = CartItem.builder().id(1L).cart(cart).product(product).quantity(1).build();
        cart.getCartItems().add(cartItem);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));
        when(cartRepository.findById(1L)).thenReturn(Optional.of(cart));

        CartResponse response = cartService.removeItem("test@test.com", 1L);

        assertThat(response).isNotNull();
        verify(cartItemRepository).delete(cartItem);
    }

    @Test
    void clearCart_removesAllItems() {
        CartItem item = CartItem.builder().id(1L).cart(cart).product(product).quantity(2).build();
        cart.getCartItems().add(item);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));

        cartService.clearCart("test@test.com");

        verify(cartItemRepository).deleteByCartId(1L);
        assertThat(cart.getCartItems()).isEmpty();
    }
}
