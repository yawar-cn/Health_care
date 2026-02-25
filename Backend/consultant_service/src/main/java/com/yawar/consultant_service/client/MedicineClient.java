package com.yawar.consultant_service.client;

import com.yawar.consultant_service.dto.MedicineDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "API-GATEWAY")
public interface MedicineClient {
    @PostMapping("/medicines/bulk")
    List<MedicineDTO> getByIds(@RequestBody List<Long> ids);
}
