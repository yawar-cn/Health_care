package com.yawar.notification_service.service;

import com.yawar.notification_service.event.PaymentSuccessEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    public void sendNotification(PaymentSuccessEvent event) {
        if (event == null) {
            log.warn("Received null PaymentSuccessEvent. Skipping notification.");
            return;
        }

        String paymentType = event.getPaymentType();
        if ("CONSULTATION".equalsIgnoreCase(paymentType)) {
            log.info("Sending consultation confirmation notification");
        } else if ("SUBSCRIPTION".equalsIgnoreCase(paymentType)) {
            log.info("Sending subscription activation notification");
        } else {
            log.info("Sending payment success notification");
        }
    }
}
