package com.cotrini.api_canchas.services;

import com.cotrini.api_canchas.dto.*;
import com.cotrini.api_canchas.entities.Cancha;
import com.cotrini.api_canchas.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CanchaService {

    private final CanchaRepository canchaRepository;
    private final SedeRepository sedeRepository;
    private final TipoCanchaRepository tipoCanchaRepository;

    public List<SedeDTO> obtenerSedes() {
        return sedeRepository.findAll().stream().map(sede -> {
            SedeDTO dto = new SedeDTO();
            dto.setId(sede.getId());
            dto.setNombre(sede.getNombre());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<TipoCanchaDTO> obtenerTiposCancha() {
        return tipoCanchaRepository.findAll().stream().map(tipo -> {
            TipoCanchaDTO dto = new TipoCanchaDTO();
            dto.setId(tipo.getId());
            dto.setNombre(tipo.getNombre());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<CanchaResponseDTO> obtenerCanchas(Long sedeId, Long tipoCanchaId) {
        List<Cancha> canchas;

        if (sedeId != null && tipoCanchaId != null) {
            canchas = canchaRepository.findBySedeIdAndTipoCanchaId(sedeId, tipoCanchaId);
        } else if (sedeId != null) {
            canchas = canchaRepository.findBySedeId(sedeId);
        } else if (tipoCanchaId != null) {
            canchas = canchaRepository.findByTipoCanchaId(tipoCanchaId);
        } else {
            canchas = canchaRepository.findAll();
        }

        return canchas.stream().map(this::mapearACanchaDTO).collect(Collectors.toList());
    }

    private CanchaResponseDTO mapearACanchaDTO(Cancha cancha) {
        CanchaResponseDTO dto = new CanchaResponseDTO();
        dto.setId(cancha.getId());
        dto.setNombre(cancha.getNombre());
        dto.setDescripcion(cancha.getDescripcion());
        dto.setCapacidad(cancha.getCapacidad());
        dto.setImagenUrl(cancha.getImagenUrl());
        dto.setNombreSede(cancha.getSede().getNombre());
        dto.setNombreTipoCancha(cancha.getTipoCancha().getNombre());
        return dto;
    }
}
