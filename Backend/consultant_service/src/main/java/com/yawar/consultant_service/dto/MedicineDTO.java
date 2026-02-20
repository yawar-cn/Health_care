package com.yawar.consultant_service.dto;

import lombok.Data;

@Data
public class MedicineDTO {

    private Long id;
    private String name;
    private Double price;
    private Integer stock;
}
