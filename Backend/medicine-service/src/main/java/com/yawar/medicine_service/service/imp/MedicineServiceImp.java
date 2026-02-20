package com.yawar.medicine_service.service.imp;

import com.yawar.medicine_service.model.Medicine;
import com.yawar.medicine_service.repo.MedicineRepo;
import com.yawar.medicine_service.service.MedicineService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineServiceImp implements MedicineService{

    private final MedicineRepo repo;

    public Medicine create(Medicine medicine) {
        return repo.save(medicine);
    }

    public List<Medicine> getAll() {
        return repo.findAll();
    }

    public Medicine getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    public List<Medicine> search(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    public List<Medicine> getByIds(List<Long> ids) {
        return repo.findAllById(ids);
    }

    @Transactional
    public void reduceStock(Long id, Integer quantity) {

        Medicine med = getById(id);

        if (med.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        med.setStock(med.getStock() - quantity);
    }
}

