package com.cotrini.api_canchas.services;

import com.cotrini.api_canchas.entities.Horario;
import com.cotrini.api_canchas.repositories.HorarioRepository;
import com.cotrini.api_canchas.repositories.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisponibilidadService {

    private final HorarioRepository horarioRepository;
    private final ReservaRepository reservaRepository;

    public List<Horario> obtenerHorariosDisponibles(Long canchaId, LocalDate fecha) {
        List<Horario> todosLosHorarios = horarioRepository.findAll();

        List<Long> idsHorariosReservados = reservaRepository.findByCanchaIdAndFecha(canchaId, fecha)
                .stream()
                .map(reserva -> reserva.getHorario().getId())
                .collect(Collectors.toList());

        return todosLosHorarios.stream()
                .filter(horario -> !idsHorariosReservados.contains(horario.getId()))
                .collect(Collectors.toList());
    }
}
