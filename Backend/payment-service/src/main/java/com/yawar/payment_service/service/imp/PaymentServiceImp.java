package com.yawar.payment_service.service.imp;

import com.razorpay.*;
import com.yawar.payment_service.dto.CreateOrderRequest;
import com.yawar.payment_service.dto.PaymentSuccessEvent;
import com.yawar.payment_service.dto.VerifyPaymentRequest;
import com.yawar.payment_service.model.PaymentModel;
import com.yawar.payment_service.repo.PaymentRepo;
import com.yawar.payment_service.service.PaymentEventProducer;
import com.yawar.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImp implements PaymentService {
    private final RazorpayClient razorpayClient;
    private final PaymentRepo repo;
    private final RestTemplate restTemplate;

    @Value("${razorpay.key.secret}")
    private String keySecret;
    private final PaymentEventProducer eventProducer;
    // 1️⃣ Create Order
    @Override
    public String createOrder(CreateOrderRequest request) throws RazorpayException {

        JSONObject options = new JSONObject();
        options.put("amount", request.getAmount() * 100); // paise
        options.put("currency", "INR");
        options.put("receipt", request.getReferenceId());

        Order order = razorpayClient.orders.create(options);

        // Save initial payment
        PaymentModel payment = PaymentModel.builder()
                .referenceId(request.getReferenceId())
                .paymentType(request.getPaymentType())
                .razorpayOrderId(order.get("id"))
                .amount(request.getAmount())
                .status("CREATED")
                .build();

        repo.save(payment);

        return order.toString();
    }

    // 2️⃣ Verify Payment
    @Override
    public String verifyPayment(VerifyPaymentRequest request) throws RazorpayException {
        String payload = request.getRazorpayOrderId() + "|" +
                request.getRazorpayPaymentId();

        boolean isValid = Utils.verifySignature(
                payload,
                request.getRazorpaySignature(),
                keySecret
        );

        if (!isValid) {
            throw new RuntimeException("Invalid signature");
        }

        PaymentModel payment = repo.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setStatus("SUCCESS");
        repo.save(payment);

        PaymentSuccessEvent event = new PaymentSuccessEvent(
                payment.getReferenceId(),
                payment.getPaymentType(),
                payment.getAmount(),
                payment.getRazorpayPaymentId()
        );

        // Do downstream work in background so verify response is fast and resilient.
        CompletableFuture.runAsync(() -> publishPaymentEvent(event));

        if ("CONSULTATION".equals(payment.getPaymentType())) {
            CompletableFuture.runAsync(() -> markConsultationPaid(payment.getReferenceId()));
        }

        return "Payment Verified";
    }

    private void publishPaymentEvent(PaymentSuccessEvent event) {
        try {
            eventProducer.publishPaymentSuccess(event);
        } catch (Exception e) {
            log.warn("Payment event publish failed for referenceId={}", event.getReferenceId(), e);
        }
    }

    private void markConsultationPaid(String referenceId) {
        try {
            restTemplate.put(
                    "http://CONSULTANT-SERVICE/consultations/{id}/paid",
                    null,
                    referenceId
            );
        } catch (Exception e) {
            log.warn("Consultation status update failed for referenceId={}", referenceId, e);
        }
    }
}
