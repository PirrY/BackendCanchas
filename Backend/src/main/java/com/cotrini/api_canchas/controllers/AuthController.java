package com.cotrini.api_canchas.controllers;

import com.cotrini.api_canchas.dto.LoginRequestDTO;
import com.cotrini.api_canchas.dto.RegistroRequestDTO;
import com.cotrini.api_canchas.dto.TokenResponseDTO;
import com.cotrini.api_canchas.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroRequestDTO request) {
        authService.registrarUsuario(request);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO request) {
        TokenResponseDTO token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}
