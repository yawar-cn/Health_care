package com.yawar.payment_service.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private String referenceId;
    private String paymentType;
    private Double amount;
}

