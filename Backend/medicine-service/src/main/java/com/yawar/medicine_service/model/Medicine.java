package com.yawar.medicine_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medicines")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String manufacturer;

    private String description;

    private Double price;

    private Integer stock;

    private String category;
}
