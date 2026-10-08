package com.shopsphere.shipping.dto;

import com.shopsphere.common.enums.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShipmentStatusRequest {

    @NotNull(message = "Shipment status is required")
    private ShipmentStatus status;

    private String currentLocation;

    private String notes;
}
