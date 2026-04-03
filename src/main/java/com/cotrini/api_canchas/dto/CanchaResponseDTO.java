package com.cotrini.api_canchas.dto;

import lombok.Data;

@Data
public class CanchaResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer capacidad;
    private String imagenUrl;
    private String nombreSede;
    private String nombreTipoCancha;
}
