package com.yawar.payment_service.service;

import com.razorpay.RazorpayException;
import com.yawar.payment_service.dto.CreateOrderRequest;
import com.yawar.payment_service.dto.VerifyPaymentRequest;

public interface PaymentService {
    String createOrder(CreateOrderRequest request)  throws RazorpayException;

    String verifyPayment(VerifyPaymentRequest request)  throws RazorpayException;
}
