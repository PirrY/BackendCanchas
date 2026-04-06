package com.cotrini.api_canchas.controllers;

import com.cotrini.api_canchas.dto.ReservaRequestDTO;
import com.cotrini.api_canchas.dto.ReservaResponseDTO;
import com.cotrini.api_canchas.services.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crearReserva(
            @RequestBody ReservaRequestDTO request,
            Principal principal) {
        String correoUsuario = (principal != null) ? principal.getName() : "test@test.com";
        return ResponseEntity.ok(reservaService.crearReserva(request, correoUsuario));
    }

    @GetMapping("/mis-reservas")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerMisReservas(Principal principal) {
        String correoUsuario = (principal != null) ? principal.getName() : "test@test.com";
        return ResponseEntity.ok(reservaService.obtenerMisReservas(correoUsuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelarReserva(@PathVariable Long id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.ok("Reserva cancelada con éxito");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> editarReserva(
            @PathVariable Long id,
            @RequestBody ReservaRequestDTO request,
            Principal principal) {
        // Extraemos el correo del JWT tal como lo haces en los otros métodos
        String correoUsuario = (principal != null) ? principal.getName() : "test@test.com";

        ReservaResponseDTO reservaActualizada = reservaService.editarReserva(id, request, correoUsuario);
        return ResponseEntity.ok(reservaActualizada);
    }
}
