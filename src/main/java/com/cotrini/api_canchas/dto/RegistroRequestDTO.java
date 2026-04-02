package com.cotrini.api_canchas.dto;

import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String nombre;
    private String correo;
    private String password;
}
