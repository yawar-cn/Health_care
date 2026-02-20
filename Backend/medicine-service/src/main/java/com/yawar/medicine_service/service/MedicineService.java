package com.yawar.medicine_service.service;

import com.yawar.medicine_service.model.Medicine;

import java.util.List;

public interface MedicineService {
    Medicine create(Medicine medicine);

    List<Medicine> getAll();

    Medicine getById(Long id);

    List<Medicine> getByIds(List<Long> ids);

    List<Medicine> search(String name);
}
