package com.cotrini.api_canchas.repositories;

import com.cotrini.api_canchas.entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);

    List<Reserva> findByCanchaIdAndFecha(Long canchaId, LocalDate fecha);

    boolean existsByCanchaIdAndHorarioIdAndFecha(Long canchaId, Long horarioId, LocalDate fecha);
}
