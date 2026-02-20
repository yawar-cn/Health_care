package com.yawar.payment_service.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {

    private String referenceId;
    private String paymentType;
    private Double amount;
}
