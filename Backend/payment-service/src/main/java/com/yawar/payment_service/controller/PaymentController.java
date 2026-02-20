package com.yawar.payment_service.controller;

import com.razorpay.RazorpayException;
import com.yawar.payment_service.dto.CreateOrderRequest;
import com.yawar.payment_service.dto.VerifyPaymentRequest;
import com.yawar.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(
            @RequestBody CreateOrderRequest request)
            throws RazorpayException {

        return ResponseEntity.ok(service.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(
            @RequestBody VerifyPaymentRequest request)
            throws RazorpayException {

        return ResponseEntity.ok(service.verifyPayment(request));
    }
}

