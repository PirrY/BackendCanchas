package com.cotrini.api_canchas.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReservaRequestDTO {
    private Long canchaId;
    private Long horarioId;
    private LocalDate fecha;
}
