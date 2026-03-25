package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.dto.response.OrderItemResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.dto.response.PageResponse;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse placeOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
            .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Cannot place an order with an empty cart");
        }

        Address address = addressRepository.findById(request.getShippingAddressId())
            .orElseThrow(() -> new ResourceNotFoundException("Address", request.getShippingAddressId()));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Address does not belong to the user");
        }

        Order order = Order.builder()
            .user(user)
            .shippingAddress(address)
            .paymentMethod(request.getPaymentMethod())
            .status(Order.OrderStatus.PENDING)
            .paymentStatus(Order.PaymentStatus.PENDING)
            .totalAmount(cart.getTotalAmount())
            .build();

        List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(cartItem.getQuantity())
                .priceAtPurchase(product.getDiscountedPrice())
                .build();
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after order
        cart.getCartItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());

        return toResponse(savedOrder);
    }

    public PageResponse<OrderResponse> getUserOrders(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Order> orders = orderRepository.findByUserId(
            user.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return PageResponse.<OrderResponse>builder()
            .content(orders.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
            .page(orders.getNumber())
            .size(orders.getSize())
            .totalElements(orders.getTotalElements())
            .totalPages(orders.getTotalPages())
            .first(orders.isFirst())
            .last(orders.isLast())
            .build();
    }

    public OrderResponse getOrderById(String email, Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!order.getUser().getId().equals(user.getId()) &&
            user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }
        return toResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(String email, Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        if (order.getStatus() == Order.OrderStatus.SHIPPED ||
            order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a shipped or delivered order");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        // Restore stock
        order.getOrderItems().forEach(item -> {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        });

        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status);
        }

        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
            .map(item -> {
                String imgUrl = item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()
                    ? item.getProduct().getImages().get(0).getImageUrl() : null;
                return OrderItemResponse.builder()
                    .id(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .productImageUrl(imgUrl)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(item.getPriceAtPurchase())
                    .subtotal(item.getSubtotal())
                    .build();
            }).collect(Collectors.toList());

        Address addr = order.getShippingAddress();
        AddressResponse addrResp = addr == null ? null : AddressResponse.builder()
            .id(addr.getId()).street(addr.getStreet()).city(addr.getCity())
            .state(addr.getState()).zipCode(addr.getZipCode()).country(addr.getCountry())
            .build();

        return OrderResponse.builder()
            .id(order.getId())
            .status(order.getStatus().name())
            .totalAmount(order.getTotalAmount())
            .paymentMethod(order.getPaymentMethod())
            .paymentStatus(order.getPaymentStatus().name())
            .shippingAddress(addrResp)
            .orderItems(items)
            .createdAt(order.getCreatedAt())
            .build();
    }
}
