package com.yawar.notification_service.consumer;

import com.yawar.notification_service.event.PaymentSuccessEvent;
import com.yawar.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "payment-success-topic")
    public void consume(PaymentSuccessEvent event) {
        log.info("Received PaymentSuccessEvent: {}", event);
        notificationService.sendNotification(event);
    }
}
