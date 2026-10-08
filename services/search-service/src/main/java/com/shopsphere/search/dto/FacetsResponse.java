package com.shopsphere.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacetsResponse {
    private Map<String, Long> categories;
    private Map<String, Long> brands;
}
