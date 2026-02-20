package com.yawar.payment_service.repo;

import com.yawar.payment_service.model.PaymentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PaymentRepo extends JpaRepository<PaymentModel, Long> {
    Optional<PaymentModel> findByRazorpayOrderId(String razorpayOrderId);
}

