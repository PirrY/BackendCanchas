package com.cotrini.api_canchas.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservaResponseDTO {
    private Long idReserva;
    private Long canchaId;
    private LocalDate fecha;
    private String nombreCancha;
    private String nombreSede;
    private String imagenUrlCancha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
