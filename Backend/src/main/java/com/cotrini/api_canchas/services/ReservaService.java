package com.cotrini.api_canchas.services;

import com.cotrini.api_canchas.dto.*;
import com.cotrini.api_canchas.entities.*;
import com.cotrini.api_canchas.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final HorarioRepository horarioRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;

    // Consultar horarios disponibles excluyendo los ocupados
    public List<Horario> obtenerHorariosDisponibles(Long canchaId, LocalDate fecha) {
        List<Horario> todosLosHorarios = horarioRepository.findAll();
        List<Long> horariosOcupados = reservaRepository.findByCanchaIdAndFecha(canchaId, fecha)
                .stream()
                .map(res -> res.getHorario().getId())
                .collect(Collectors.toList());

        return todosLosHorarios.stream()
                .filter(h -> !horariosOcupados.contains(h.getId()))
                .collect(Collectors.toList());
    }

    // Crear una nueva reserva
    @Transactional
    public ReservaResponseDTO crearReserva(ReservaRequestDTO request, String correoUsuario) {
        if (reservaRepository.existsByCanchaIdAndHorarioIdAndFecha(
                request.getCanchaId(), request.getHorarioId(), request.getFecha())) {
            throw new RuntimeException("El horario ya está reservado para esa fecha");
        }

        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Cancha cancha = canchaRepository.findById(request.getCanchaId())
                .orElseThrow(() -> new RuntimeException("Cancha no encontrada"));
        Horario horario = horarioRepository.findById(request.getHorarioId())
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        Reserva reserva = new Reserva();
        reserva.setUsuario(usuario);
        reserva.setCancha(cancha);
        reserva.setHorario(horario);
        reserva.setFecha(request.getFecha());

        Reserva reservaGuardada = reservaRepository.save(reserva);
        return mapearAReservaDTO(reservaGuardada);
    }

    // Consultar reservas del usuario
    public List<ReservaResponseDTO> obtenerMisReservas(String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return reservaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(this::mapearAReservaDTO)
                .collect(Collectors.toList());
    }

    // Cancelar reserva
    @Transactional
    public void cancelarReserva(Long idReserva) {
        reservaRepository.deleteById(idReserva);
    }

    private ReservaResponseDTO mapearAReservaDTO(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setIdReserva(reserva.getId());
        dto.setCanchaId(reserva.getCancha().getId());
        dto.setFecha(reserva.getFecha());
        dto.setNombreCancha(reserva.getCancha().getNombre());
        dto.setNombreSede(reserva.getCancha().getSede().getNombre());
        dto.setImagenUrlCancha(reserva.getCancha().getImagenUrl());
        dto.setHoraInicio(reserva.getHorario().getHoraInicio());
        dto.setHoraFin(reserva.getHorario().getHoraFin());
        return dto;
    }

    // Editar una reserva existente
    @Transactional
    public ReservaResponseDTO editarReserva(Long idReserva, ReservaRequestDTO request, String correoUsuario) {
        Reserva reservaActual = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (!reservaActual.getUsuario().getCorreo().equals(correoUsuario)) {
            throw new RuntimeException("No tienes permiso para editar esta reserva");
        }

        boolean cambiaHorario = !reservaActual.getHorario().getId().equals(request.getHorarioId());
        boolean cambiaFecha = !reservaActual.getFecha().equals(request.getFecha());
        boolean cambiaCancha = !reservaActual.getCancha().getId().equals(request.getCanchaId());

        if (cambiaHorario || cambiaFecha || cambiaCancha) {
            if (reservaRepository.existsByCanchaIdAndHorarioIdAndFecha(
                    request.getCanchaId(), request.getHorarioId(), request.getFecha())) {
                throw new RuntimeException("El nuevo horario ya está reservado para esa fecha");
            }

            if (cambiaHorario) {
                Horario nuevoHorario = horarioRepository.findById(request.getHorarioId())
                        .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
                reservaActual.setHorario(nuevoHorario);
            }
            if (cambiaCancha) {
                Cancha nuevaCancha = canchaRepository.findById(request.getCanchaId())
                        .orElseThrow(() -> new RuntimeException("Cancha no encontrada"));
                reservaActual.setCancha(nuevaCancha);
            }
            if (cambiaFecha) {
                reservaActual.setFecha(request.getFecha());
            }
        }

        Reserva reservaActualizada = reservaRepository.save(reservaActual);
        return mapearAReservaDTO(reservaActualizada);
    }
}
