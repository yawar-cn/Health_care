package com.yawar.payment_service.service;

import com.yawar.payment_service.dto.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, PaymentSuccessEvent> kafkaTemplate;

    private static final String TOPIC = "payment-success-topic";

    public void publishPaymentSuccess(PaymentSuccessEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}

