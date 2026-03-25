package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.exception.BadRequestException;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock CartService cartService;
    @Mock CartRepository cartRepository;
    @Mock CartItemRepository cartItemRepository;
    @Mock UserRepository userRepository;
    @Mock AddressRepository addressRepository;
    @Mock ProductRepository productRepository;
    @InjectMocks OrderService orderService;

    private User user;
    private Cart cart;
    private Product product;
    private Address address;
    private CartItem cartItem;

    @BeforeEach
    void setup() {
        user = User.builder().id(1L).email("test@test.com").firstName("Test").lastName("User").role(User.Role.CUSTOMER).build();
        address = Address.builder().id(1L).user(user).street("123 Main St").city("NYC").state("NY").zipCode("10001").country("US").build();
        product = Product.builder()
            .id(1L).name("Test Product").price(new BigDecimal("99.99"))
            .discountPercent(0).stockQuantity(10).images(new ArrayList<>()).isActive(true).build();
        cartItem = CartItem.builder().id(1L).product(product).quantity(2).build();
        cart = Cart.builder().id(1L).user(user).cartItems(new ArrayList<>(List.of(cartItem))).build();
        cartItem.setCart(cart);
    }

    @Test
    void placeOrder_success() {
        OrderRequest request = new OrderRequest();
        request.setShippingAddressId(1L);
        request.setPaymentMethod("CREDIT_CARD");

        Order savedOrder = Order.builder()
            .id(1L).user(user).status(Order.OrderStatus.PENDING)
            .totalAmount(new BigDecimal("199.98")).shippingAddress(address)
            .paymentMethod("CREDIT_CARD").paymentStatus(Order.PaymentStatus.PENDING)
            .orderItems(new ArrayList<>()).build();

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderResponse response = orderService.placeOrder("test@test.com", request);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo("PENDING");
        verify(productRepository, atLeastOnce()).save(any(Product.class));
    }

    @Test
    void placeOrder_emptyCart_throwsBadRequest() {
        cart.getCartItems().clear();
        OrderRequest request = new OrderRequest();
        request.setShippingAddressId(1L);
        request.setPaymentMethod("CREDIT_CARD");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        assertThatThrownBy(() -> orderService.placeOrder("test@test.com", request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("empty cart");
    }

    @Test
    void placeOrder_insufficientStock_throwsBadRequest() {
        product.setStockQuantity(1);
        cartItem.setQuantity(5);

        OrderRequest request = new OrderRequest();
        request.setShippingAddressId(1L);
        request.setPaymentMethod("CREDIT_CARD");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        assertThatThrownBy(() -> orderService.placeOrder("test@test.com", request))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Insufficient stock");
    }

    @Test
    void cancelOrder_pendingOrder_success() {
        Order order = Order.builder()
            .id(1L).user(user).status(Order.OrderStatus.PENDING)
            .totalAmount(BigDecimal.TEN)
            .orderItems(List.of(OrderItem.builder().product(product).quantity(1).build()))
            .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.save(any())).thenReturn(product);
        when(orderRepository.save(any())).thenReturn(order);

        OrderResponse response = orderService.cancelOrder("test@test.com", 1L);

        assertThat(response.getStatus()).isEqualTo("CANCELLED");
    }

    @Test
    void cancelOrder_shippedOrder_throwsBadRequest() {
        Order order = Order.builder()
            .id(1L).user(user).status(Order.OrderStatus.SHIPPED)
            .totalAmount(BigDecimal.TEN).orderItems(new ArrayList<>())
            .build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> orderService.cancelOrder("test@test.com", 1L))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Cannot cancel");
    }

    @Test
    void updateOrderStatus_validStatus_success() {
        Order order = Order.builder()
            .id(1L).user(user).status(Order.OrderStatus.PENDING)
            .totalAmount(BigDecimal.TEN).orderItems(new ArrayList<>()).build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        OrderResponse response = orderService.updateOrderStatus(1L, "CONFIRMED");

        assertThat(response.getStatus()).isEqualTo("CONFIRMED");
    }

    @Test
    void updateOrderStatus_invalidStatus_throwsBadRequest() {
        Order order = Order.builder().id(1L).user(user).status(Order.OrderStatus.PENDING)
            .totalAmount(BigDecimal.TEN).orderItems(new ArrayList<>()).build();

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.updateOrderStatus(1L, "INVALID_STATUS"))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Invalid order status");
    }
}
