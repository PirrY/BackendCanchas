package com.cotrini.api_canchas.services;

import com.cotrini.api_canchas.dto.SedeDTO;
import com.cotrini.api_canchas.dto.TipoCanchaDTO;
import com.cotrini.api_canchas.entities.Cancha;
import com.cotrini.api_canchas.repositories.CanchaRepository;
import com.cotrini.api_canchas.repositories.SedeRepository;
import com.cotrini.api_canchas.repositories.TipoCanchaRepository;
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

    public List<Cancha> obtenerCanchas(Long sedeId, Long tipoCanchaId) {
        if (sedeId != null && tipoCanchaId != null) {
            return canchaRepository.findBySedeIdAndTipoCanchaId(sedeId, tipoCanchaId);
        } else if (sedeId != null) {
            return canchaRepository.findBySedeId(sedeId);
        } else if (tipoCanchaId != null) {
            return canchaRepository.findByTipoCanchaId(tipoCanchaId);
        }
        return canchaRepository.findAll();
    }

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
}
