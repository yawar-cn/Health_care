package com.yawar.consultant_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSuccessEvent {

    private String referenceId;
    private String paymentType;
    private Double amount;
}

