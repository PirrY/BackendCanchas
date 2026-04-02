package com.cotrini.api_canchas.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String correo;
    private String password;
}
