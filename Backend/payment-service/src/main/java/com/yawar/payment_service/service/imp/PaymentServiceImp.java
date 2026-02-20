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
import org.springframework.beans.factory.annotation.Value;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImp implements PaymentService {
    private final RazorpayClient razorpayClient;
    private final PaymentRepo repo;

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

    @Override
    public String verifyPayment(VerifyPaymentRequest request) {

        PaymentModel payment = repo
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setRazorpayPaymentId("TEST_PAYMENT_ID");
        payment.setStatus("SUCCESS");

        repo.save(payment);
        PaymentSuccessEvent event = new PaymentSuccessEvent(
                payment.getReferenceId(),
                payment.getPaymentType(),
                payment.getAmount(),
                payment.getRazorpayPaymentId()
        );
        eventProducer.publishPaymentSuccess(event);
        return "Payment Marked SUCCESS & Event Published";
    }

    // 2️⃣ Verify Payment
//    @Override
//    public String verifyPayment(VerifyPaymentRequest request) throws RazorpayException {
//
//        try {
//
//            String payload = request.getRazorpayOrderId() + "|" +
//                    request.getRazorpayPaymentId();
//
//            boolean isValid = Utils.verifySignature(
//                    payload,
//                    request.getRazorpaySignature(),
//                    keySecret
//            );
//
//            if (!isValid) {
//                throw new RuntimeException("Invalid signature");
//            }
//
//            PaymentModel payment = repo.findByRazorpayOrderId(request.getRazorpayOrderId()).orElseThrow(() -> new RuntimeException("Payment not found"));
//
//            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
//            payment.setStatus("SUCCESS");
//
//            repo.save(payment);
//
//            // 🔥 Publish Kafka Event
//            PaymentSuccessEvent event = new PaymentSuccessEvent(
//                    payment.getReferenceId(),
//                    payment.getPaymentType(),
//                    payment.getAmount(),
//                    payment.getRazorpayPaymentId()
//            );
//
//            eventProducer.publishPaymentSuccess(event);
//
//            return "Payment Verified & Event Published";
//
//        } catch (Exception e) {
//            throw new RuntimeException("Payment verification failed", e);
//        }
//    }
}
