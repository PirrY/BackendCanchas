package com.cotrini.api_canchas.controllers;

import com.cotrini.api_canchas.dto.CanchaResponseDTO;
import com.cotrini.api_canchas.dto.SedeDTO;
import com.cotrini.api_canchas.dto.TipoCanchaDTO;
import com.cotrini.api_canchas.services.CanchaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;

    @GetMapping
    public ResponseEntity<List<CanchaResponseDTO>> obtenerCanchas(
            @RequestParam(required = false) Long sedeId,
            @RequestParam(required = false) Long tipoCanchaId) {
        return ResponseEntity.ok(canchaService.obtenerCanchas(sedeId, tipoCanchaId));
    }

    @GetMapping("/sedes")
    public ResponseEntity<List<SedeDTO>> obtenerSedes() {
        return ResponseEntity.ok(canchaService.obtenerSedes());
    }

    @GetMapping("/tipos")
    public ResponseEntity<List<TipoCanchaDTO>> obtenerTiposCancha() {
        return ResponseEntity.ok(canchaService.obtenerTiposCancha());
    }
}
