package com.yawar.consultant_service.kafka;
import com.yawar.consultant_service.event.PaymentSuccessEvent;
import com.yawar.consultant_service.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final ConsultationService consultationService;

    @KafkaListener(
            topics = "payment-success-topic",
            groupId = "consultation-group"
    )
    public void consume(PaymentSuccessEvent event) {

        if ("CONSULTATION".equals(event.getPaymentType())) {
            consultationService.markAsPaid(event.getReferenceId());
        }
    }
}
