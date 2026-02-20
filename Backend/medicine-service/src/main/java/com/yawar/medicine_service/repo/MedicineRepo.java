package com.yawar.medicine_service.repo;

import com.yawar.medicine_service.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepo extends JpaRepository<Medicine,Long> {
    List<Medicine> findByNameContainingIgnoreCase(String name);
}
