package com.yawar.medicine_service.controller;

import com.yawar.medicine_service.model.Medicine;
import com.yawar.medicine_service.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService service;

    @PostMapping
    public ResponseEntity<Medicine> create(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(service.create(medicine));
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Medicine>> getByIds(@RequestBody List<Long> ids) {
        return ResponseEntity.ok(service.getByIds(ids));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> search(@RequestParam String name) {
        return ResponseEntity.ok(service.search(name));
    }
}

