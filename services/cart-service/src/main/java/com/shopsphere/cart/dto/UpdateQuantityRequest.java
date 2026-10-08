package com.shopsphere.cart.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuantityRequest {

    @Min(value = 0, message = "Quantity cannot be negative")
    private int quantity;
}
