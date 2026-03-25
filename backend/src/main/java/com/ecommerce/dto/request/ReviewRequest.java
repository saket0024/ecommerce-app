package com.ecommerce.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    @Size(max = 200)
    private String title;

    @Size(max = 5000)
    private String body;
}
