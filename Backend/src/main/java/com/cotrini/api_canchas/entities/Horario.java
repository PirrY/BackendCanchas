package com.cotrini.api_canchas.entities;

import jakarta.persistence.*;
import java.time.LocalTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "horarios")
public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
